import numpy as np
import torch
import clip
import faiss
from PIL import Image

model, preprocess = clip.load("ViT-B/32")

index = faiss.read_index("monument_index.faiss")
labels = np.load("labels.npy")

def search_image(query_path):

    image = preprocess(Image.open(query_path).convert("RGB")).unsqueeze(0)

    with torch.no_grad():
        feature = model.encode_image(image)

    feature = feature.numpy().astype("float32")

    distances, indices = index.search(feature, 1)

    return labels[indices[0][0]]