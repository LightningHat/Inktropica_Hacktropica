import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')  # Replace with your table name

def lambda_handler(event, context):
    method = event['httpMethod']

    # CORS Headers (for all responses)
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    # Handle OPTIONS (Preflight)
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'message': 'CORS preflight success'})
        }

    try:
        if method == 'PUT' or method == 'POST':
            body = json.loads(event['body'])
            id = body.get('id')
            email = body.get('email')
            firstName = body.get('firstName')
            lastName = body.get('lastName')

            # Save user to DynamoDB
            table.put_item(
                Item={
                    'id': id,
                    'email': email,
                    'firstName': firstName,
                    'lastName': lastName,
                    'createdAt': datetime.utcnow().isoformat()
                }
            )

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'message': 'User data saved successfully.'})
            }

        elif method == 'GET':
            # Example: Read all users (modify as needed for your use case)
            response = table.scan()
            users = response.get('Items', [])

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'users': users})
            }

        else:
            return {
                'statusCode': 405,
                'headers': cors_headers,
                'body': json.dumps({'message': 'Method Not Allowed'})
            }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
