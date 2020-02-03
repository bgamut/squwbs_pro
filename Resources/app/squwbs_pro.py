import os
baseCommand=os.path.dirname(os.getcwd())+r"/Resources/app/src/assets/node-v13.3.0-darwin-x64"
command1=baseCommand+" "+os.path.dirname(os.getcwd())+r"/Resources/app/starter.js"
if os.path.isfile(baseCommand):
   command=command1 
   print(command)
else:
   command=os.path.dirname(os.getcwd())+r"/app/src/assets/node-v13.3.0-darwin-x64 "+os.path.dirname(os.getcwd())+r"/app/starter.js"
   print(command)
os.system(command)
