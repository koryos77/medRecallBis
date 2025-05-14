# --------------------MedRecall--------------------

MedRecall is a python program that sends you a text to remind you when to take your meds.
Enter the med that you need, chose an hour to send you a text, enter your phone number, accept. That's all.

The program was developed by me with Vite, React, Tailwind and Flask, and send message with Twilio.

For now the program can only work locally, so you can clone the project, install the requirements from requirements.txt with pip.
Create an account on Twilio and go in app.py file. Modify these variables:

![variables_app_py](<Capture d'écran 2025-05-14 183851.png>)

Add your infos in it.

Open your terminal, go in 'backend' directory and execute: `python app.py`. The backend should run wihtout issues.
Open another terminal, go at the root of the project and execute `npm run dev`. The frontend should run without issues.
CTRL + click on `Local:   http://localhost:5173/`
Enter the med that you need, chose an hour to send you a text, enter your phone number, accept. That's all.
