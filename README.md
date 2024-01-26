# POOSD-PenguinBook
Group project number one for Processes in Object Orientated Software Development

IP address: 159.65.249.52 

Domain name: penguinbook.xyz 

Discord: https://discord.gg/sPbgbKXz 

Git Hub: https://github.com/Prdevoney/POOSD-PenguinBook.git 

Jira: https://penguinbook.atlassian.net/jira/software/projects/PB/boards/1

Sample: https://github.com/Paradise-Pages/COP4331-Group6.git

Root Pass: POOSD-2024-Spring

USER Permission for Database:
    
    User: 'TheBeast' 
    Password: 'POOSD-2024-Spring'

Roles: 

    Patrick DeVoney: Project Manager 

    Yuto Kikuchi: Data Base, Front End

    Katrina Nicolasora: Front End 

    Garrison Scarboro: Front End

    John Trucillo: API

    Adrian Hernandez: API 

Push Edits to Server: 

    1. Connect to the server using PuTTY with IP address and Root Pass. 

    2. Username: root
       Password: POOSD-2024-Spring 

    3.  Use command: cd /var/www/html 

    4. use command "git pull" 
        This will pull all the edits that we have pushed to the project thus far, and automatically update the website.

    5. If it is telling you that there is a conflict and you just want to make the code on the server exactly the same
       as the git repo then use command: "git reset --hard origin/main"

Git Commits Show in Jira (this is totally optional, just thought it would be good to learn): 

    1. When commiting a change write at the begining of the commit message: "PB-x" 
        1.1. Where x is the number of the task in Jira. 
        1.2. The task number will be next to the blue checkmark on the task icon. 

    2. Now you can go to Jira, click on the task you were working on, and see the commit 
       that you just made that relates to that task. 

Connect to Server with PuTTY: 

    1. Install PuTTY for Windows from: https://the.earth.li/~sgtatham/putty/0.80/w64/putty-64bit-0.80-installer.msi
        It will start downloading as soon as you click that link. 
        I don't know what to do if you have a Mac. 

    2. Navigate to where you installed PuTTY on your computer and open "putty.exe"

    3. Paste in the IP address where it says "Host Name"

    4. click "open" 

    5. Login with: 
        Username: root 
        Password: POOSD-2024-Spring 

Clone This Repo Locally: 

    1. Open a new window in VS code 

    2. Select Clone Git Repository
        It may ask you to log into github

    3. Select this repository "POOSD-PenguinBook"

    4. Select where you want to store it on your computer

Once in mysql Database:

    Log in normally
    
    mysql -u root -p (press enter)
    POOSD-2024-Spring (Enter Password)

    1. Mysql> Use COP4331;
    2. MySql> select * from Users; <- Checks User
    3. MySql> select * from Contacts where UserID=(value);
    

