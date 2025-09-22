
/**
 * Formats a phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number is valid (10 digits for US)
  if (cleaned.length !== 10) {
    return phoneNumber; // Return original if not valid
  }
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
