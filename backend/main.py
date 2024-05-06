from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from flask import make_response
from functools import wraps
from datetime import timedelta
from dotenv import load_dotenv
import os
import hashlib
import jwt
import datetime
import secrets
import re
import logging

app = Flask(__name__)

load_dotenv(".env")

# mongoDB
client = MongoClient(os.environ.get('DATABASE_URL'))

# db connection
db = client['QWE-Vehicle-Tracker']

app_cors_url = os.environ.get('APP_CORS_URL')

CORS(app, supports_credentials=True, resources={r"/*": {"origins": app_cors_url}})

# JWT security key
SECRET_KEY = os.environ.get('SECRET_KEY')

# user blocking variables
invalid_attempts = {}
lockout_time = 60 * 30

# logging.basicConfig(level=logging.DEBUG)
# Set up logging
logging.basicConfig(filename='api.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s: %(message)s')


def authenticate_token():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            token = None
            if "token" in request.cookies:
                token = request.cookies.get('token')
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            try:
                decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                # You can perform additional checks here, such as checking if the user has the necessary permissions
                # to access the resource.
                return func(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token!'}), 401

        return wrapper

    return decorator


# Hashing function
def secure_hash(inputItem):
    salt = secrets.token_hex(16)
    salted_input = inputItem + salt
    hashed_input = hashlib.sha256(salted_input.encode()).hexdigest()
    return (hashed_input, salt)


def generate_jwt_token(userID):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2),
        'iat': datetime.datetime.utcnow(),
        'sub': userID
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


def handle_invalid_login(emailID):
    if emailID in invalid_attempts:
        invalid_attempts[emailID]['count'] += 1
        invalid_attempts[emailID]['timestamp'] = datetime.datetime.utcnow()
    else:
        invalid_attempts[emailID] = {'count': 1, 'timestamp': datetime.datetime.utcnow()}


def check_user_failed_attempt(emailID):
    print(emailID, invalid_attempts)
    if emailID in invalid_attempts and invalid_attempts[emailID]['count'] >= 3:
        time_elapsed = datetime.datetime.utcnow() - invalid_attempts[emailID]['timestamp']
        time_left = timedelta(seconds=lockout_time) - time_elapsed
        minutes, seconds = divmod(time_left.seconds, 60)
        formatted_time_left = f"{minutes:02d}:{seconds:02d}"
        return True, formatted_time_left
    else:
        return False, None


# APIs to post, fetch information regarding users
@app.route('/users', methods=['POST', 'GET', "PUT"])
def userData():
    # POST a single user data to database *****REGISTER****
    if request.method == 'POST':
        # Log request data
        logging.info(f'Request received: {request.json}')

        body = request.json
        userID = body['userID']
        userFirstName = body['userFirstName']
        userLastName = body['userLastName']
        userEmail = body['userEmail']
        userPassword = secure_hash(body['userPassword'])
        hashed_password, salt = secure_hash(body['userPassword'])
        userPhoneNumber = body['userPhoneNumber']
        accessPermission = body['accessPermission']
        userProfile = body['userProfile']

        # Validate fields
        # Checking for missing fields
        if not userID or not userFirstName or not userLastName or not userEmail or not userPassword or not userPhoneNumber:
            return jsonify({
                'status': 'Missing required fields!',
                'message': 'failure'
            })

        if not re.match(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', userEmail):
            return jsonify({
                'status': 'Email address is invalid!',
                'message': 'failure'
            })

        if not re.match(r'^(?:(?:\+|00)44|0)\s*[1-9]\d{1,4}\s*\d{6,7}$', str(userPhoneNumber)):
            return jsonify({
                'status': 'Invalid Phone Number',
                'message': 'failure'
            })

        if db['users'].find_one({"userEmail": userEmail}):
            return jsonify({
                'status': 'User already exists!',
                'message': "failure"
            })
        else:
            # If user does not exist, insert new user into the database
            db['users'].insert_one({
                "userID": userID,
                "userFirstName": userFirstName,
                "userLastName": userLastName,
                "userEmail": userEmail,
                "userPassword": hashed_password,
                "passwordSalt": salt,
                "userPhoneNumber": userPhoneNumber,
                "userProfile": userProfile,
                "accessPermission": accessPermission
            })
            db['notifications'].insert_one({
                "userID": userID,
                "userFirstName": userFirstName,
                "userLastName": userLastName,
                "userEmail": userEmail,
                "userPhoneNumber": userPhoneNumber,
                "userProfile": userProfile,
                "accessPermission": accessPermission
            })

            return jsonify({
                'status': 'User Registered Succesfully!',
                'message': "success",
            })

    # GET all user data from database
    if request.method == 'GET':
        allData = db['users'].find()
        dataJson = []
        for data in allData:
            userID = data['userID']
            userFirstName = data['userFirstName']
            userLastName = data['userLastName']
            userEmail = data['userEmail']
            userPhoneNumber = data['userPhoneNumber']
            accessPermission = data['accessPermission']
            userProfile = data['userProfile']
            dataDict = {
                'userID': userID,
                'userFirstName': userFirstName,
                'userLastName': userLastName,
                'userEmail': userEmail,
                'userPhoneNumber': userPhoneNumber,
                'accessPermission': accessPermission,
                'userProfile': userProfile,
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

    if request.method == 'PUT':
        logging.info(f'Request received: {request.json}')
        body = request.json
        userID = body['userID']
        userFirstName = body['userFirstName']
        userLastName = body['userLastName']
        userEmail = body['userEmail']
        userPhoneNumber = body['userPhoneNumber']
        accessPermission = body['accessPermission']

        db['users'].update_one(
            {'userID': userID},
            {
                "$set": {
                    'userFirstName': userFirstName,
                    'userLastName': userLastName,
                    'userEmail': userEmail,
                    'userPhoneNumber': userPhoneNumber,
                    'accessPermission': accessPermission,
                }
            }
        )
        print('\n # Update on user details is successful # \n')
        return jsonify({'status': 'user data with ID: ' + userID + ' is updated!', 'message': 'success'})


# api to get details of a specific user by email
@app.route('/users/<string:userEmail>', methods=['GET'])
def getUserDetails(userEmail):
    # GET a specific data by userID
    if request.method == 'GET':
        data = db['users'].find_one({'userEmail': userEmail})
        userID = data['userID']
        userFirstName = data['userFirstName']
        userLastName = data['userLastName']
        userEmail = data['userEmail']
        userPhoneNumber = data['userPhoneNumber']
        accessPermission = data['accessPermission']
        userProfile = data['userProfile']
        # userName = data['userName']
        dataDict = {
            'userID': userID,
            'userFirstName': userFirstName,
            'userLastName': userLastName,
            'userEmail': userEmail,
            'accessPermission': accessPermission,
            'userPhoneNumber': userPhoneNumber,
            'userProfile': userProfile,
            # 'userName': userName,
        }
        print(dataDict)
        return jsonify(dataDict)


# api to get the user signin to the application - authentication
@app.route('/users/signin', methods=['POST'])
def signin():
    body = request.json
    userEmail = body['userEmail']
    userPassword = body['userPassword']
    user = db['users'].find_one({"userEmail": userEmail})

    # Validate fields
    # Checking for missing fields
    if not userEmail or not userPassword:
        return jsonify({
            'status': 'Missing required fields!',
            'message': 'failure'
        })

    if not re.match(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', userEmail):
        print("email")
        return jsonify({
            'status': 'Email address is invalid!',
            'message': 'failure'
        })

    # to check the persmission
    data = db['users'].find_one({'userEmail': userEmail})
    if user:
        hashed_password = user['userPassword']
        salt = user['passwordSalt']
        accessPermission = user['accessPermission']
        salted_input = userPassword + salt
        input_hash = hashlib.sha256(salted_input.encode()).hexdigest()
        isUserTriesExceeded, timeLeft = check_user_failed_attempt(userEmail)

        if isUserTriesExceeded:
            logging.warning("User Tries exceeded the maximum allowed")
            return jsonify({
                'status': 'Maximum number of tries exceeded! Please try after ' + timeLeft,
                'message': "failure"
            }), 401
        if input_hash == hashed_password:
            if accessPermission:

                # If user is found in the database, generate JWT token and return it in the response
                token = generate_jwt_token(str(user['userID']))
                response = make_response(jsonify({'status': 'User authenticated successfully!', 'message': "success"}))
                response.set_cookie(key='token', value=token, httponly=True, secure=True, samesite="None")
                return response
            elif not accessPermission:
                logging.warning("User not authenticated : approval-waiting")
                return jsonify({
                    'status': 'Waiting for Admin approval',
                    'message': "approval-waiting",

                }), 401
        else:
            handle_invalid_login(userEmail)
            logging.error("Invalid email or password!")
            return jsonify({
                'status': 'Invalid email or password!',
                'message': "failure"
            }), 401
    else:
        return jsonify({
            'status': 'User not found!',
            'message': "failure"
        })


# APIs to post, fetch information regarding vehicles
@app.route('/vehicles', methods=['POST', 'GET', 'PUT', 'DELETE'])
@authenticate_token()
def vehicleData():
    # POST a single vehicle data to database
    if request.method == 'POST':
        # Log request data
        logging.info(f'Request received: {request.json}')
        body = request.json
        vehicleID = body['vehicleID']
        vehicleStatus = body['vehicleStatus']
        if db['vehicles'].find_one({"vehicleID": vehicleID}):
            return jsonify({
                'status': 'Vehicle already exists!',
                'message': "failure"
            })
        else:
            # If vehicle does not exist, insert new vehicle into the database
            db['vehicles'].insert_one({
                "vehicleID": vehicleID,
                "vehicleStatus": vehicleStatus,
            })
            logging.info("vehicle Data is posted to MongoDB!")
            return jsonify({
                'status': 'vehicle Data is posted to MongoDB!',
                'message': "success"
            })

    # get all vehicle information from the database
    if request.method == 'GET':
        allData = db['vehicles'].find()
        dataJson = []
        for data in allData:
            vehicleID = data['vehicleID']
            vehicleStatus = data['vehicleStatus']
            dataDict = {
                'vehicleID': vehicleID,
                'vehicleStatus': vehicleStatus,
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

    # DELETE a particular vehicle details from the database
    if request.method == 'DELETE':
        body = request.json
        vehicleID = body['vehicleID']
        db['vehicles'].delete_many({'vehicleID': vehicleID})
        print('\n # Deletion successful # \n')
        return jsonify({'status': 'Vehicle with id: ' + vehicleID + ' is deleted!',
                        'message': 'success'
                        }
                       )

    # UPDATE a single vehicle information by id
    if request.method == 'PUT':
        logging.info(f'Request received: {request.json}')
        body = request.json
        vehicleID = body['vehicleID']
        vehicleStatus = body['vehicleStatus']
        db['vehicles'].update_one(
            {'vehicleID': vehicleID},
            {
                "$set": {
                    "vehicleID": vehicleID,
                    "vehicleStatus": vehicleStatus,
                }
            }
        )
        print('\n # Update on vehicle details is successful # \n')
        return jsonify({'status': 'vehicle data with ID: ' + vehicleID + ' is updated!', 'message': 'success'})


# api to fectch, update, delete details of a specific vehicle by its ID
@app.route('/vehicles/<string:vehicleID>', methods=['GET'])
def getVehicleDetails(vehicleID):
    # GET a specific data by vehicleID
    if request.method == 'GET':
        data = db['vehicles'].find_one({'vehicleID': vehicleID})
        vehicleID = data['vehicleID']
        vehicleStatus = data['vehicleStatus']
        dataDict = {
            'vehicleID': vehicleID,
            'vehicleStatus': vehicleStatus,
        }
        print(dataDict)
        return jsonify(dataDict)


# APIs to fetch information regarding security teams
@app.route('/teams', methods=['GET'])
@authenticate_token()
def getTeamDetails():
    # GET all security team information from database
    if request.method == 'GET':
        allData = db['security-team'].find()
        dataJson = []
        for data in allData:
            teamID = data['teamID']
            teamName = data['teamName']
            teamContactPerson = data['teamContactPerson']
            teamContactEmail = data['teamContactEmail']
            teamContactPhoneNumber = data['teamContactPhoneNumber']
            dataDict = {
                'teamID': teamID,
                'teamName': teamName,
                'teamContactPerson': teamContactPerson,
                'teamContactEmail': teamContactEmail,
                'teamContactPhoneNumber': teamContactPhoneNumber,
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)


@app.route('/logistics', methods=['POST', 'GET', 'PUT', 'DELETE'])
@authenticate_token()
def logisticsData():
    # POST a single vehicle data to database
    if request.method == 'POST':
        # Log request data
        logging.info(f'Request received: {request.json}')
        body = request.json
        logisticsID = body['logisticsID']
        vehicleID = body['vehicleID']
        vehicleStatus = body['vehicleStatus']
        routeName = body["routeName"]
        securityTeamName = body["securityTeamName"]

        # validations
        required_fields = ['logisticsID', 'vehicleID', 'vehicleStatus', 'routeName', 'securityTeamName']
        missing_fields = set(required_fields) - set(body.keys())
        if missing_fields:
            return jsonify({
                'status': f'Missing fields: {", ".join(missing_fields)}',
                'message': 'failure'
            })

        valid_vehicle_statuses = ['available', 'out-of-depot', 'out-of-service', 'on-destination', 'on-the-route']
        if vehicleStatus not in valid_vehicle_statuses:
            return jsonify({
                'status': f'Invalid vehicle status: {vehicleStatus}. Must be one of {", ".join(valid_vehicle_statuses)}',
                'message': 'failure'
            })

        if db['logistics'].find_one({"vehicleID": vehicleID}):
            return jsonify({
                'status': 'Vehicle already assigned!',
                'message': "failure"
            })
        else:
            # If vehicle is not assigned, insert new vehicle into the database
            db['logistics'].insert_one({
                "logisticsID": logisticsID,
                "vehicleID": vehicleID,
                "vehicleStatus": vehicleStatus,
                "routeName": routeName,
                "securityTeamName": securityTeamName
            })
            return jsonify({
                'status': 'Logistics Data is posted to MongoDB!',
                'message': "success"
            })

    # get all vehicle information from the database
    if request.method == 'GET':
        allData = db['logistics'].find()
        dataJson = []
        for data in allData:
            logisticsID = data['logisticsID']
            vehicleID = data['vehicleID']
            vehicleStatus = data['vehicleStatus']
            routeName = data["routeName"]
            securityTeamName = data["securityTeamName"]
            dataDict = {
                'id': logisticsID,
                'vehicleID': vehicleID,
                'vehicleStatus': vehicleStatus,
                "routeName": routeName,
                "securityTeamName": securityTeamName
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

    # DELETE a particular vehicle details from the database
    if request.method == 'DELETE':
        body = request.json
        vehicleID = body['vehicleID']
        db['logistics'].delete_many({'vehicleID': vehicleID})
        print('\n # Deletion successful # \n')
        return jsonify({'status': 'Vehicle with id: ' + vehicleID + ' is deleted!',
                        'message': 'success'
                        }
                       )

    # UPDATE a single vehicle information by id
    if request.method == 'PUT':
        logging.info(f'Request received: {request.json}')
        body = request.json
        vehicleID = body['vehicleID']
        vehicleStatus = body['vehicleStatus']
        routeName = body['routeName']
        securityTeamName = body['securityTeamName']
        # logisticsID = body[logisticsID]
        db['logistics'].update_one(
            {'vehicleID': vehicleID},
            {
                "$set": {
                    # "logisticsID":logisticsID,
                    "vehicleID": vehicleID,
                    "vehicleStatus": vehicleStatus,
                    "routeName": routeName,
                    "securityTeamName": securityTeamName
                }
            }
        )
        print('\n # Update on vehicle details is successful # \n')
        return jsonify({'status': 'vehicle data with ID: ' + vehicleID + ' is updated!', 'message': 'success'})


@app.route('/routes', methods=['POST', 'GET', 'DELETE'])
@authenticate_token()
def routesData():
    # POST a single route data to database
    if request.method == 'POST':
        # Log request data
        logging.info(f'Request received: {request.json}')
        body = request.json
        routeID = body['routeID']
        routeName = body['routeName']
        startLoc = body['startLoc']
        endLoc = body['endLoc']
        if db['routes'].find_one({"routeName": routeName}):
            return jsonify({
                'status': 'Route Name already exists! Please give a different name.',
                'message': "failure"
            })
        elif db['routes'].find_one({"startLoc": startLoc, "endLoc": endLoc}):
            return jsonify({
                'status': 'Specified route already exists!',
                'message': "failure"
            })
        else:
            # If route name does not exist, insert new route into the database
            db['routes'].insert_one({
                "routeID": routeID,
                "routeName": routeName,
                "startLoc": startLoc,
                "endLoc": endLoc,
            })
            return jsonify({
                'status': 'New Route Added!',
                'message': "success"
            })

    # get all route information from the database
    if request.method == 'GET':
        allData = db['routes'].find()
        dataJson = []
        for data in allData:
            routeID = data['routeID']
            routeName = data['routeName']
            startLoc = data['startLoc']
            endLoc = data['endLoc']
            dataDict = {
                "id": routeID,
                "routeName": routeName,
                "startLoc": startLoc,
                "endLoc": endLoc,
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

    # DELETE a particular vehicle details from the database
    if request.method == 'DELETE':
        body = request.json
        routeID = body['routeID']
        db['routes'].delete_many({'routeID': routeID})
        print('\n # Deletion successful # \n')
        return jsonify({'status': 'Vehicle with id: ' + routeID + ' is deleted!',
                        'message': 'success'
                        }
                       )


@app.route('/notifications', methods=['GET', 'DELETE'])
@authenticate_token()
def getNotificationDetails():
    # GET all security team information from database
    if request.method == 'GET':
        allData = db['notifications'].find()
        dataJson = []
        for data in allData:
            userFirstName = data['userFirstName']
            userID = data['userID']
            userLastName = data['userLastName']
            userEmail = data['userEmail']
            userPhoneNumber = data['userPhoneNumber']
            accessPermission = data['accessPermission']
            dataDict = {
                'userID': userID,
                'userFirstName': userFirstName,
                'userLastName': userLastName,
                'userEmail': userEmail,
                'userPhoneNumber': userPhoneNumber,
                'accessPermission': accessPermission
            }
            dataJson.append(dataDict)
        print(dataJson)
        return jsonify(dataJson)

    if request.method == 'DELETE':
        body = request.json
        userID = body['userID']
        db['notifications'].delete_many({'userID': userID})
        print('\n # Deletion successful # \n')
        return jsonify({'status': 'userID with id: ' + userID + ' is deleted!',
                        'message': 'success'
                        }
                       )


if __name__ == '__main__':
    app.debug = True
    app.run()
