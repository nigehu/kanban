# Installation Instructions for Django

The instructions are derived from the youtube course here: <https://www.youtube.com/watch?v=rHux0gMZ3Eg&ab_channel=ProgrammingwithMosh>

## Step 1: Install PipEnv

Create a virtual environment that will be used to install everything needed for web development. In this case the virtual environment will be call **web** and will be made in the current directory where you will be building the web app.

```zsh
    python -m venv ./web
```

 You will then need to enter the virtual environment you just created.

```zsh
    source ./web/bin/activate
```

With a virtual environment, you can now install pipenv which is a package manager useful for web development, similar to npm.

```zsh
    pip install pipenv
```

## Step 2: Create Django Environment

Still inside of your virtual environment, you will now install django.

```zsh
    pip install django
```

Now with django installed, you will create the app using the cli. In this case our app is going to be called myproject

```zsh
    django-admin startproject myproject
```

Now with your project created, you can call manage.py to use the project specific cli tools that django provides.

## Step 3: Setup VSCode for Launching

To start the app from a terminal you can run the following command:

```zsh
    python manage.py runserver
```

However, if we would like to use vscode as our IDE then we will need to set it up. Start by creating a .vscode folder in the root of your app with a settings.json file. The following path will lead to the python interpreter for the virutal environment you created earlier, in this case **web**.

```json
{
    "python.pythonPath": "/Users/nigelhughes/Documents/Programming/Web_Development/web/bin/python"
}
```

Now with the interpreter set up, you will need to create launch instructions for vscode. Either go to the debug tab and create a launch.json file by choosing django as the type or create it manually with the following configuration.

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Django",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/manage.py",
            "args": [
                "runserver",
                "9000"
            ],
            "django": true
        }
    ]
}
```

Now when you run the application using vscode, it will start up correctly using your virtual environment.

## Step 4 Connecting app to site

Django works by having an app within a project. The project holds the admin/cli stuff associated with django while the app will be where you will actually build your code. To do this you will need to create an app and then connect that app to your project. Using the following command you can create your app:

```zsh
    python manage.py startapp myapp
```

From here you will need to connect your app to your project. Do this by opening up settings.py in your project folder and add the name of your app to the list of installed apps:

```python
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'myapp'
    ]
```

Once you have this setup, it should be able to recognize that your app is included in the project and be able to find it.

## Additional Info

### Migrations

In order to manage migrations, you will make changes to the models.py file and create your database models. From here you will run the following command to update your migrations scripts.

```zsh
    python manage.py makemigrations myapp
```

This will create the migrations folder as well as update your details. This is essentially the same as staging in git and you will need to "commit" these changes using the following command:

```zsh
    python manage.py migrate
```

### Admin Setup

To create an admin login, you will need to first create a super user.

```zsh
    python manage.py createsuperuser
```

This will create prompt for you to enter user credentials. Once you've created the admin account, you will be able to access it at **/admin** and login.
