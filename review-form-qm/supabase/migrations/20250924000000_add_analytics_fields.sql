-- Add analytics fields to review_requests table
ALTER TABLE public.review_requests
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'clicked', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS physician_name TEXT,
ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS review_rating INTEGER CHECK (review_rating >= 1 AND review_rating <= 5);

-- Create indexes for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_review_requests_sent_at ON public.review_requests(sent_at);
CREATE INDEX IF NOT EXISTS idx_review_requests_created_by ON public.review_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_review_requests_status ON public.review_requests(status);
CREATE INDEX IF NOT EXISTS idx_review_requests_physician ON public.review_requests(physician_name);

-- Create a view for analytics aggregation
CREATE OR REPLACE VIEW public.review_analytics AS
SELECT
  DATE_TRUNC('day', sent_at) as date,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN status = 'clicked' THEN 1 END) as total_clicked,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_completed,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as total_failed,
  ROUND(AVG(response_time_minutes)::numeric, 2) as avg_response_time,
  ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / NULLIF(COUNT(*), 0), 2) as completion_rate
FROM public.review_requests
GROUP BY DATE_TRUNC('day', sent_at);

-- Create function to calculate response time
CREATE OR REPLACE FUNCTION calculate_response_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND NEW.sent_at IS NOT NULL THEN
    NEW.response_time_minutes := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.sent_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for response time calculation
DROP TRIGGER IF EXISTS trigger_calculate_response_time ON public.review_requests;
CREATE TRIGGER trigger_calculate_response_time
BEFORE UPDATE ON public.review_requests
FOR EACH ROW
EXECUTE FUNCTION calculate_response_time();

-- Grant permissions
GRANT SELECT ON public.review_analytics TO authenticated;
GRANT SELECT, UPDATE ON public.review_requests TO authenticated;