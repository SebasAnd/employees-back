# <h1>Employess APP</h1>

this app was created with nodejs  and contains a crud for a company managemen this company has a hierarchical structure into his employees, for this reason this back manage the database using two tables

1. employees: where the personal information of the employees is saved, this contains the email, name, position and the version of the employee register
2. relations: this table contains the diferent relations boss/employee of every employee of the company

after the data structure is defined, the back use the current endopint to manage the crud of the users

1. addUser: POST endpoint that creates a new user in the system
2. getUsers: get the information of the employees and relations in the current system.
3. getUser?email="...": get the information of a particular user in the system, this includes his personal information and the relation where the employee is involved
4. updateUser: enpoint created to update the employee information this also includes the relation of the employee
5. deleteUser: delete the imformation of one employee in the system

Exists also some particualr requitements to conisder for the system, the solution of them is decribed on this list

### <h2>Data Structure:</h2>
this parameter was solved in the information described before where expains the data structure and the data management, the version is a parmeter that exists in the employee table and this parameter is updated when
the user is updated and in other statement that wiil be described in the nexts point 

### <h2>Hierarchical Query with Versioning:</h2>
this web service is stores in this repository <em>https://github.com/SebasAnd/empl-front</em> and contains a web app that connect with this back and can show and edit the databse information. 
This front was created in angular version 17.

### <h2>Update Scenario:</h2>
this validation exists in functon of this app named "VerifyNullBoss()", here validates all the employess of the database, and detemine if that employess does not  have a boss, if this happend two scenarios occurs
1. exist a boss without employees: in this case the employee will be assigned to this boss in the relation table.
2. all the boss have employees: in this case the system will find the boss with less employess in charge and will add the employee to this boss
this funciton is also called when any update or change toe employess occurs. Every time that this function is used the version of the employee without a boss will be updated.

### <h2>Handling Nulls:</h2>
The function "VerifyNullBoss()" also will be used if this case occurs in any employees change 
