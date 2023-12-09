# Employee Management System

This application manages company information using a CRUD system, focusing on the hierarchical structure of its employees. The database is structured with two tables:

1. **employees:** Contains personal information such as email, name, position, and employee version.
2. **relations:** Stores various boss/employee relationships within the company.

After defining the data structure, the backend provides the following endpoints for CRUD operations:

1. **addUser:** POST endpoint to create a new user in the system.
2. **getUsers:** Retrieves information about employees and their relationships in the system.
3. **getUser?email="...":** Retrieves information about a specific user, including personal details and related relationships.
4. **updateUser:** Endpoint to update employee information, including their relationship.
5. **deleteUser:** Deletes information about an employee in the system.

## Particular Requirements

### 1. Data Structure

Define an efficient data structure to store information about employees, their hierarchical relationships, and the version associated with each employee. The details are explained in the preceding sections.

### 2. Hierarchical Query with Versioning

The hierarchical query with versioning is implemented through a web service, available in [this repository](https://github.com/SebasAnd/empl-front). The accompanying front-end, developed in Angular version 17, connects to this backend to display and edit database information.

### 3. Update Scenario

The update process in the database is handled by the function named "VerifyNullBoss()." This function validates all employees and determines if an employee lacks a direct supervisor. The scenarios and solutions are detailed in the application. Every use of this function updates the version of an employee without a boss.

### 4. Handling Nulls

The function "VerifyNullBoss()" is also invoked in scenarios where an employee does not have a direct supervisor during any employee change.

## Technical Test

### Implementation

The code corresponding to the solution is provided in the language, frameworks, and technologies of your choice.

### Usage Example

An example is given with at least three employees and their hierarchical relationships, including cases where an employee changes their supervisor and where an employee does not have a direct superior.
