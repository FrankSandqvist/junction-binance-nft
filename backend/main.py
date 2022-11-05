#import config
import os
from flask_cors import CORS, cross_origin
import urllib
import urllib.request
import json
import numpy as np
import os
import cv2
import pandas as pd
from flask import Flask, request, render_template, send_file
from clipmodel import EmbedderOpenCLIP
from indexer import Indexer

df = pd.read_csv('file1.csv')
#clip_embedder = EmbedderOpenCLIP()
clip_embedder = EmbedderOpenCLIP(device = 'cpu', clip_model_name = 'ViT-B-16-plus-240', pretrained = 'laion400m_e32')

app = Flask(__name__)
indexer = Indexer()
indexer.load('features.npy')

@app.route('/search_by_image', methods=['POST'])
@cross_origin()
def search_by_image():
    image_undecoded = request.get_data()
    img = cv2.imdecode(np.frombuffer(image_undecoded, np.uint8), -1)
    emb = clip_embedder.encode_imgs(img)
    dists, indexes = indexer.find(emb, topn = 5)
    ##reverse image bgr rgb
    return dists, indexes


@app.route('/search_by_prompt', methods=['POST'])
@cross_origin()
def search_by_prompt():
    content = request.json
    prompt = content['prompt']
    amount = content['amount']
    emb = clip_embedder.encode_text(prompt)
    dists, indexes = indexer.find(emb,topn = amount)
    loc = df.iloc[indexes]
    return {'dists': str(list(dists)), 'names' : str(list(loc.Name.values)), 'urls': str(list(loc.Url.values))}
    #return {'dists':str(dists), 'indexes':str(indexes)}


if __name__ == '__main__':
    print("Starting server on port 8000")
    app.run(host="0.0.0.0", port=8000)

