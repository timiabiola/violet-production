#!/usr/bin/env node

console.log('=== Environment Variable Check ===\n');

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY'
];

const optionalVars = [
  'VITE_SUPABASE_ANON_KEY'
];

console.log('Required Environment Variables:');
let missingRequired = false;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (length: ${value.length})`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    missingRequired = true;
  }
});

console.log('\nOptional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (length: ${value.length})`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

console.log('\nAll VITE_ prefixed variables:');
Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .forEach(key => {
    console.log(`  - ${key}: ${process.env[key] ? 'Set' : 'Empty'}`);
  });

if (missingRequired) {
  console.log('\n❌ Missing required environment variables!');
  console.log('\nTo fix this in Vercel:');
  console.log('1. Go to your Vercel project settings');
  console.log('2. Navigate to "Environment Variables"');
  console.log('3. Add the following variables:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  console.log('4. Make sure they are enabled for Production environment');
  console.log('5. Trigger a new deployment');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
}