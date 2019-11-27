# Office Front Desk 
## Innovaccer SDE-Intern Assignment
This project is a NodeJS webapp, serving a host-vistor checkin system which could be implemented at any office desk.
A running version can be seen [here](ovacer-1ec3d.appspot.com).
**Steps for local deployment are mentioned at the [end](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout#steps-for-local-deployment) of this file.**
### Features
As mentioned in the problem statement, this application has the following features:  
+ _**The Home Page**_  
  The homepage provides the visitors for 2 options, namely **Checkin** and **Checkout**. The new visitors coming to visit the office can easily tap on checkin to continue. If they have attended the meeting they could tap on checkout and continue the procedure.  
  ![HomeGif](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/home.gif)  
+ _**The Checkin Form**_  
  The visitor form opens up for visitors to fill in the details and tap on the checkin button. This triggers 2 functionalities. First, an email is sent to the host with all the details of the visitor. Secondly a sms is also sent to the host containing the same details.  
  Here I have used [nodemailer](https://www.npmjs.com/package/nodemailer) npm package and [way2sms](https://www.way2sms.com/) online service for sending emails and sms respectively.
  ![Checkin](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/checkin.gif)  
    On tapping on Checkin button, you recieve a confirmation message along with the checkin time.  
  ![Checkedin](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/form.gif)
  
+ _**The Checkout Page**_  
   Once the user taps on the checkout button on Home Page, they are redirected to the **Current Meetings** page. On tapping checkout on their session the visitor checks out and details of the meeting are sent to the visitor.
  ![Checkedin](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/checkout.gif)
  
+ _**Past Meetings**_  
    One can also view the past sessions/meetings.
    ![Checkedin](https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/pastmeets.gif) 
+ _**Emails and SMS**_  
    These gifs provide you a look at the email and sms received by the host and visitor.  
    <img style="float:left;" src="https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/Screenshot_2019-11-27-01-55-28-934_com.google.android.gm-01.jpeg" height="400px" border = "2"/>
    <img style="float:left;" src="https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/Screenshot_2019-11-28-00-04-16-056_com.android.mms-01.jpeg" height="400px" border = "2" />
    <img style="float:left;" src="https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout/blob/master/GIFs/Screenshot_2019-11-27-23-36-26-848_com.google.android.gm-01.jpeg" height = "400px"/>  
### Working Explained
The project uses NodeJS as the backend server. The **Cloud Firestore** is initialised. As usual the routes handle all the **GET** and **POST** requests. The POST _/checkinresults_ route handles post request of the form. Here we have parsed the request and got the various variable like the name, email etc. The **Cloud Firestore** then gets requests to add data to _visitors_ collection. After this we send email and sms to the host. On checkout we pull the data from the firestore sorted in order by the timestamp which were added when we created the entries. Next, with dynamic routing we pass the doc ID to the _checkinresults_ page where that entry is deleted from the firestore. At the same time we also update another entry in a collection named _visited_ on DB. This collection populated the Past Sessions page. Finally we send an email to the visitor with all the details.   

### Steps for Local deployment  
Ensure you have NodeJS and npm installed.   
+ Clone this repository. `git clone https://github.com/thetseffect/Office-FrontDesk-CheckIn-Checkout.git`.
- Enter the repo directory. `cd Office-FrontDesk-CheckIn-Checkout`
- Open up the terminal/command-line and run `npm install`. This will install the required dependencies listed in package.json.
- Once all dependencies are installed type in `npm start` to fire up the server.
- You will see on the terminal _App running on port 8080_.
- Go to the browser and type in `127.0.0.1:8080`.
- The homepage opens up and we are done!

### Credits
[Tarun Singh](https://www.linkedin.com/in/thetseffect/) 

