yarn build
aws s3 sync dist s3://agiledevui/ \
--delete \
--exclude index.html \
--cache-control max-age=31536000,public,immutable


aws s3 sync dist s3://agiledevui/ \
--delete \
--exclude "*!index.html" \
--cache-control max-age=0,no-cache,no-store,must-revalidate