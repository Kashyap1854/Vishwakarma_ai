import streamlit as st
from search import search_image
from PIL import Image
import wikipedia
import json
import string

with open("requirements.json") as f:
    monument_db = json.load(f)

st.title("Indian Monument Recognition AI")

uploaded_file = st.file_uploader("Upload Monument Image")

if uploaded_file:

    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_container_width=True)

    with open("temp.jpg", "wb") as f:
        f.write(uploaded_file.getbuffer())

    
    monument = search_image(uploaded_file)
    monument_name = string.capwords(monument.replace("_", " "))

    st.header(monument_name)

    st.subheader("Monument Details")

    info = monument_db.get(monument_name)

    if info:
        st.markdown(f"""
        • **Architecture:** {info.get("architecture")}  
        • **Built:** {info.get("built")}  
        • **Builder:** {info.get("builder")}  
        • **Location:** {info.get("location")}  
        """)
    else:
        st.warning("Details not found in database")

    try:
        summary = wikipedia.summary(monument_name, sentences=4)
        st.subheader("Description")
        st.write(summary)
    except:
        st.write("Description not available.")



    st.caption(f"Detected monument: {monument_name}")