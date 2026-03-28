import os
import torch
import clip
import numpy as np
from PIL import Image
import faiss

model, preprocess = clip.load("ViT-B/32")

dataset_path = "dataset"

features = []
labels = []

for monument in os.listdir(dataset_path):

    folder = os.path.join(dataset_path, monument)

    if not os.path.isdir(folder):
        continue

    for img_name in os.listdir(folder):

        path = os.path.join(folder, img_name)

        try:
            image = preprocess(Image.open(path).convert("RGB")).unsqueeze(0)

            with torch.no_grad():
                feature = model.encode_image(image)

            features.append(feature[0].numpy())
            labels.append(monument)

        except:
            print("Error:", path)

features = np.array(features).astype("float32")

# Create FAISS index
dimension = features.shape[1]
index = faiss.IndexFlatL2(dimension)

index.add(features)

faiss.write_index(index, "monument_index.faiss")
np.save("labels.npy", labels)

print("FAISS index created successfully")