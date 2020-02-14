import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from pprint import pprint
import numpy as np
import json
obje=[]
with open('../src/assets/sampleDataLabels.json') as json_file:
  obje=json.load(json_file)
  # print(obje)
  header=obje['header']
  data=obje['data']
  testXS=[]
  testYS=[]
  for entry in data:
    # print(entry)
    initArray= np.zeros(len(header))
    testXS.append(entry['hashes'])
    # print(entry['category'])
    category=int(entry['category'])
    # print(type(category))
    initArray[category]=1
    testYS.append(initArray)

print(np.array(testXS))
print('=====================================')
print(np.array(testYS))

# Load the fashion-mnist pre-shuffled train data and test data
# (x_train, y_train), (x_test, y_test) = tf.keras.datasets.fashion_mnist.load_data()
# (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# x_train = np.array([[-1, 2, 3], [0, 2, 3], [1, 2, 3], [2, 2, 3], [3, 2, 3], [4, 2, 3]])
# y_train = np.array([[1,0,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,0,1]])
# x_test =  np.array([[-1, 2, 3], [0, 2, 3], [1, 2, 3], [2, 2, 3], [3, 2, 3], [4, 2, 3]])
# y_test =  np.array([[1,0,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,0,1,0,0], [0,0,0,0,1]])

x_train= np.array(testXS,dtype=np.float32)
y_train=np.array(testYS,dtype=np.float32)
x_test= np.array(testXS,dtype=np.float32)
y_test=np.array(testYS,dtype=np.float32)


print("x_train shape:", x_train.shape, "y_train shape:", y_train.shape)
# x_train = x_train.reshape(60000, 784).astype('float32') / 255
# x_test = x_test.reshape(10000, 784).astype('float32') / 255
# x_train = x_train.reshape(x_train.shape[0], 1, 28, 28).astype('float32') / 255
# x_test = x_test.reshape(x_test.shape[0], 1, 28, 28).astype('float32') / 255
print(x_train.shape[0])
# x_train = x_train.reshape(x_train.shape[0], 28, 28, 1).astype('float32')
# x_test = x_test.reshape(x_test.shape[0], 28, 28, 1).astype('float32')
#plt.imshow(x_train[0])
# x_train = x_train.astype('float32') / 255
# x_test = x_test.astype('float32') / 255

# x_train = x_train.reshape(x_train.shape[0], 1, 28, 28)
# x_test = x_test.reshape(x_test.shape[0], 1, 28, 28)
print(x_train[0])
model = tf.keras.Sequential()

# model.add(tf.keras.layers.Dense(1,activation='relu',input_shape=(28,28)))
model.add(tf.keras.layers.Dense(1,activation='relu',input_shape=([x_train.shape[1]])))
# model.add(tf.keras.layers.Dense(units= 1, activation= 'softmax'))
model.add(tf.keras.layers.Dense(units= y_train.shape[1], activation= 'softmax'))
model.summary()
model.compile(loss='mean_squared_error',
             optimizer='adam',
             metrics=['accuracy'])

class LossAndErrorPrintingCallback(tf.keras.callbacks.Callback):

#   def on_train_batch_end(self, batch, logs=None):
#     print('For batch {}, loss is {:7.2f}.'.format(batch, logs['loss']))

#   def on_test_batch_end(self, batch, logs=None):
#     print('For batch {}, loss is {:7.2f}.'.format(batch, logs['loss']))

  def on_epoch_end(self, epoch, logs):
    print("epoch # "+str(epoch))
    for key in logs.keys():
        print(key)
    # print('The average loss for epoch {i} is {:7.2f} and mean absolute error is {:7.2f}.'.format(epoch, logs['loss'], logs['mae']))
model.fit(x_train,
         y_train,
         batch_size=64,
         epochs=300,
         validation_split=0.125,
         shuffle=True
         )

# score = model.evaluate(x_test, y_test, batch_size=128, verbose=0, steps=5)
score = model.evaluate(x_test, y_test, batch_size=1, verbose=0, steps=5)
# Print test accuracy
print('\n', 'Test accuracy:', score[1])
# model.save_weights('./checkpoints/my_checkpoint')
model.save('./checkpoints/my_checkpoint.h5')