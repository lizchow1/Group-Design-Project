1. run `pip install -r requirements.txt` to install all requirements

I added firebase. Here are the instructions.
1. Go to `Firebase`, right click `settings`, choose `Service Account`. Then generate a new private key.
![alt text](<src/img/截屏2025-02-19 18.15.57.png>)
2. Download the key. It will be a `.json` file.
3. Set the environment variable permanently
![alt text](<src/img/截屏2025-02-19 18.18.46.png>)
4. Check if the environment variable is set properly

Go to terminal, enter `echo $FIREBASE_CREDENTIALS`. If there is a return path, you set the environment variable properly.

**For Windows users, please ask ChatGPT! Sorry about that!**
