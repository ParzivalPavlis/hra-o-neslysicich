#!/bin/bash

# Generate Supabase types with public and auth schemas
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public,auth > database.types.ts

# Copy the generated types to the src/lib/types/supabase/index.ts
cp database.types.ts src/lib/types/supabase/index.ts
