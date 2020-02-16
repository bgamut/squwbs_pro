import subprocess
from subprocess import Popen, PIPE, run
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
# def run(inputDir,outputDir,errorDir):
#     for r, d, f in os.walk(inputDir):
#         for file in f:
#             inputFilePath = os.path.abspath(os.path.join(r, file))
#             file_name = os.path.basename(inputFilePath)
#             pre, ext = os.path.splitext(file_name)
#             outputFileName = pre+".wav"
#             outputFilePath = os.path.join(outputDir,outputFileName)
#             # print(inputFilePath)
#             # print(outputDir)``
#             # print(outputFilePath)
#             # subprocess.call(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath]) 
#             # p = Popen(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
#             # p = Popen(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath], stderr=PIPE)
#             # output, err = p.communicate(b"input data that is passed to subprocess' stdin")
#             try:
#                 subprocess.call(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath])
#                 # output= check_output(command,stderr=STDOUT)
#             except:
#                 # print(inputFilePath) 
#                 # errors.append(inputFilePath)   
#                 print(file_name)  
#                 errorPath= os.path.join(errorDir,file_name)
#                 copyfile(inputFilePath,errorPath) 
def run(inputFilePath,outputFilePath,errorDir):
    # inputFilePath = os.path.abspath(os.path.join(r, file))
    file_name = os.path.basename(inputFilePath)
    pre, ext = os.path.splitext(file_name)
    # outputFileName = pre+".wav"
    #outputFilePath = os.path.join(outputDir,outputFileName)
    # print(inputFilePath)
    # print(outputDir)``
    # print(outputFilePath)
    # subprocess.call(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath]) 
    # p = Popen(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    # p = Popen(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath], stderr=PIPE)
    # output, err = p.communicate(b"input data that is passed to subprocess' stdin")
    try:
        # subprocess.call(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath])
        subprocess.call(['ffmpeg','-i',inputFilePath,'-y','-hide_banner',outputFilePath])
        # output= check_output(command,stderr=STDOUT)
        return 0
    except:
        # print(inputFilePath) 
        # errors.append(inputFilePath)   
        print(file_name)  
        errorPath= os.path.join(errorDir,file_name)
        copyfile(inputFilePath,errorPath) 
def main(args,kwargs):

    # for k,v in kwargs.items():
        # print('keyword key:'+k)
        # print('keyword value:'+v)
        # print('')
        # if k=="inputDir":
        #     inputDir=v
        # elif k=="outputDir":
        #     outputDir=v
            # print(outputDir)
    # print(kwargs['outputDir'])
    # run(kwargs['inputDir'],kwargs['outputDir'],kwargs['errorDir'])
    run(kwargs['inputFilePath'],kwargs['outputFilePath'],kwargs['errorDir'])
if __name__=='__main__':
    if(len(sys.argv)>1):
        argv=sys.argv[1:]
        kwargs={kw[0]:kw[1] for kw in [ar.split('=') for ar in argv if ar.find('=')>0]}
        args=[arg for arg in argv if arg.find('=')<0]
        main(args,kwargs)


