# roc-site
Outing club version 3 with advanced web technologies

I want a website where the officials of the Rensselaer Outing Club can quickly find and rent out gear to members of the club. 

There will be two main object types:

USERS and GEAR

TRIPS are a third object type that will eventually be released and managable by Leaders and above.

There will be five types of users, known as roles: 

 - Admin
 - Officer 
 - Chair (Activity Chair)
 - Leader (Trip Leader)
 - Member (Active/Paid member)

 - The super users known as "Admin" will be able to add, edit, rent, rent out, and even delete gear. 
 - Officers and chairs will be able to add, edit, rent, and rent out gear. 
 - Leaders will only be able to just rent, and rent out gear to members. 
 - Members can rent gear, but it has to be rented out to them by a user with one of the official roles (admin, Officer, Chair, or Leader). 

A user can have multiple roles and roles do not propogate. For instance, and Admin may or may not be an Officer. An Officer may or may not be a Chair.
