# Options in DB

## InitDone

name: `initDone`
value: Boolean

On server launch, the client checks the DB for this row. If not found or is false, the init screen is available for creating an admin user.
After the user is created, this value is set to true.

## Classes

name: `classes`
value:

```
{
  name: string,
  group: string,
  hidden: boolean
}[]
```

An array of class strings.

## SchoolPC

name: `schoolPC`
value: Integer

Specifies the number of PCs given by the school.

## RegistrationStatus

name: `registrationStatus`
value: Integer

Specifies the current status of registration.
Possible values:

- 0: Not yet started
- 1: Ongoing
- 2: Closed

## ScreenData

name: `screenData`
value: JSON

Specifies screen data to be shown.

```
screenData:
    state: Number
        0 = blackout
        1 = display text
        2 = display bracket
        3 = scroll between pages
```

## Email Settings

name: `email`
value: JSON

Specifies the credentials to send emails.

```
  host: String
  port: Number
  secure: Boolean
  user: String
  password: String
  from: String
```
