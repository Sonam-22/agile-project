# 2a_Provider-Management-Component

Our Final Appication can be accessed at : http://agiledevui.s3-website.eu-north-1.amazonaws.com/


Backend Code Base:   
Spring boot microservice application    
  Requirements:   
    - STS or IntelliJ  IDE fro development   
    - Language: Java 17   
    - Build tool :  Maven [Maven 3.5+] (mvn clean install -Dskip Tests)   
    - Spring boot Application (mvn spring-boot:run)   

    Database:  
     MySQL sserver and MySQLworkBench - add proper configuration in application.properties file in the apring boot application   
    https://dev.mysql.com/downloads/installer/    

UI Code Base:

Requirements:
 - Node v18.19.0
 - Yarn 1.22.21

Install UI dependencies 

1. Navigate to web-ui folder
2. Run `yarn install`

Run UI locally.

1. Navigate to web-ui folder
2. Run `yarn dev`
3. Navigate to  http://localhost:5173/

Deploy to aws s3
1. Navigate to web-ui folder
2. Run `sh scripts/publish-website.sh`

### AWS Backend Application Deployment Steps:

1. Begin by setting up an RDS instance with the MySQL engine in AWS, ensuring that public access is enabled.

2. For the Spring Boot application, execute the following command on your local machine to package the Maven project and generate a .jar file:
   ```
   mvn package
   ```

3. Once the .jar file is created, upload it to an S3 bucket. While uploading, grant public read access to the object.

4. Create an Ubuntu EC2 instance to host the Java application. Ensure that the inbound rule for port 3306 (SQL) is enabled in the security group of the EC2 instance.

5. Once the EC2 instance is up and running, install the Java Development Kit (JDK) on it.

6. Retrieve the .jar file from the S3 bucket to the EC2 instance using the following command:
   ```
   wget object_url
   ```

7. Run the .jar file on the EC2 instance with the following command:
   ```
   java -jar jar_file_name
   ```


