# Firestore Database Structure

This document outlines the structure of the Firestore database for the EcoFlow Manager application.

---

## 1. `projects`

This collection stores all the project data, including their interventions, stages, and audit logs.

### Fields:
- `name` (string): The main name of the project.
- `applicationNumber` (string, optional): The official application number (e.g., from a subsidy program).
- `ownerContactId` (string, reference): The ID of the contact from the `contacts` collection who owns the project.
- `deadline` (timestamp, optional): The final deadline for the project completion.
- `status` (string): The current status of the project. Can be `Προσφορά`, `Εντός Χρονοδιαγράμματος`, `Σε Καθυστέρηση`, `Ολοκληρωμένο`.
- `budget` (number): The total calculated budget for the project, derived from its interventions.
- `interventions` (array of maps): An array containing the project's interventions.
    - `masterId` (string): The ID from the `masterInterventions` collection.
    - `code` (string, optional): A custom code for the intervention.
    - `expenseCategory` (string): The category of the expense.
    - `interventionCategory` (string): The main category of the intervention.
    - `interventionSubcategory` (string, optional): A more specific subcategory.
    - `totalCost` (number): The calculated cost for this specific intervention.
    - `subInterventions` (array of maps, optional): A detailed breakdown of costs.
        - `id` (string): Unique identifier for the sub-intervention.
        - `subcategoryCode` (string): Code for the specific task.
        - `description` (string): Description of the task.
        - `cost` (number): The eligible cost for this task from the program.
        - `costOfMaterials` (number, optional): The actual cost of materials.
        - `costOfLabor` (number, optional): The actual cost of labor.
    - `stages` (array of maps): The pipeline of stages for this intervention.
        - `id` (string): Unique ID for the stage.
        - `title` (string): Title of the stage.
        - `status` (string): `Δεν έχει ξεκινήσει`, `Σε Εξέλιξη`, `Ολοκληρωμένο`, `Απέτυχε`.
        - `deadline` (timestamp): The deadline for this stage.
        - `lastUpdated` (timestamp): When the stage was last updated.
        - `assigneeContactId` (string, reference, optional): ID of the assigned contact.
- `auditLog` (array of maps): A log of all actions taken on the project.
    - `id` (string): Log entry ID.
    - `user` (map): Information about the user who performed the action.
    - `action` (string): The action performed (e.g., "Create Project").
    - `timestamp` (timestamp): When the action occurred.
    - `details` (string, optional): More details about the action.

---

## 2. `contacts`

This collection stores all contacts, including clients, suppliers, and technicians.

### Fields:
- `firstName` (string): The contact's first name.
- `lastName` (string): The contact's last name.
- `email` (string, optional): The contact's email address.
- `mobilePhone` (string, optional): The contact's mobile phone number.
- `role` (string): The role of the contact (e.g., "Πελάτης", "Προμηθευτής").
- `specialty` (string, optional): The professional specialty of the contact.
- `company` (string, optional): The company the contact works for.
- `vatNumber` (string, optional): The contact's VAT/tax number.
- `addressCity` (string, optional): The city of the contact's address.
- `avatarUrl` (string, optional, URL): URL to the contact's profile picture.

---

## 3. `masterInterventions`

This is a catalog collection that stores the predefined "master" interventions that can be added to projects.

### Fields:
- `code` (string): A unique code for the intervention type (e.g., "1.A1").
- `expenseCategory` (string): The high-level expense category.
- `interventionCategory` (string): The main category of the intervention.
- `interventionSubcategory` (string, optional): A detailed description.
- `unit` (string): The unit of measurement (e.g., "€/m²").
- `maxUnitPrice` (number): The maximum unit price allowed by the program.
- `maxAmount` (number): The maximum total amount allowed for this intervention.

---

## 4. `customLists` & `customListItems`

These collections manage dynamic dropdown lists used throughout the application.

### `customLists`
- `name` (string): The user-facing name of the list (e.g., "Μάρκες Υλικών").
- `key` (string, optional): A stable, system-level key for programmatic access (e.g., "MATERIAL_BRANDS").

### `customListItems`
- `listId` (string, reference): The ID of the parent list in the `customLists` collection.
- `name` (string): The value of the list item (e.g., "Daikin").

---

## 5. `offers`

This collection stores offers received from suppliers and contractors.

### Fields:
- `supplierId` (string, reference): The ID of the contact from the `contacts` collection.
- `type` (string): The type of offer (`general` or `perProject`).
- `projectId` (string, reference, optional): The ID of the project this offer is for.
- `description` (string): A description of the offer.
- `items` (array of maps): The line items of the offer.
  - `name` (string): Description of the item.
  - `unit` (string): Unit of measurement.
  - `quantity` (number, optional): The quantity of the item.
  - `unitPrice` (number): The price per unit.
- `fileUrl` (string, optional, URL): A link to the offer document.
- `createdAt` (timestamp): When the offer was created.