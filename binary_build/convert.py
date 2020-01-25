import subprocess
import os
import glob
import sys 

# appleLoopRoot=os.path.relpath('/Library/Audio/Apple Loops/Apple')
# a=os.walk(appleLoopRoot)
# #abspath=[]
# #relpath=[]
# if(os.path.exists(os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),'appleLoopMP3'))):
#     if(os.path.isdir(os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),'appleLoopMP3'))):
#         print('directory exists!')
#     else:
#         print('file exists!')
# else:
#     print(os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),'appleLoopMP3'))
#     subprocess.call(['mkdir',os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),'appleLoopMP3')])
# def make_directory(relative_path):
#     if(os.path.exists(os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),relative_path))):
#         if(os.path.isdir(os.path.join(os.path.relpath('/Users/bernardahn/Desktop/'),relative_path))):
#             print('directory exists!')
#         """
#         else:
#             print('file exists!')
#         """
#     else:
#         print(os.path.join('/Users/bernardahn/Desktop/appleLoopMP3',relative_path))
#         subprocess.call(['mkdir',os.path.join(os.path.relpath('/Users/bernardahn/Desktop/appleLoopMP3'),relative_path)])
    

def run():
    for r, d, f in os.walk(inputDir):
        for file in f:
            inputFile = os.path.abspath(os.path.join(r, file))
            file_name = os.path.basename(inputFile)
            pre, ext = os.path.splitext(file_name)
            outputFileName = pre+".wav"
            outputFilePath = os.path.join(outputdir,outputFileName)
            subprocess.call(['ffmpeg','-i',inputFile,'-hide_banner','-ac','1',outputFile]) 


def main(args,kwargs):
    print(args)
    for k,v in kwargs.items():
        print('keyword key:'+k)
        print('keyword value:'+v)
        print('')
if __name__=='__main__':
    if(len(sys.argv)>1):
        argv=sys.argv[1:]
        kwargs={kw[0]:kw[1] for kw in [ar.split('=') for ar in argv if ar.find('=')>0]}
        args=[arg for arg in argv if arg.find('=')<0]
        main(args,kwargs)