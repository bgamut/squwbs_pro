import os
bc=os.path.dirname(os.cwd())+r"/Resources/app/src/node-v13.3.0-darwin-x64"
command1=bc+" "+os.path.dirname(os.getcwd())+r"/Resources/app/starter.js"
if os.path.isfile(bc):
  command=command1
else:
  command=os.path.dirname(os.cwd())+r"/app/src/assets/node-v13.3.0-darwin-x64 "+os.path.dirname(os.getcwd())+r"/app/starter.js"
os.system(command)
