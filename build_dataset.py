from icrawler.builtin import BingImageCrawler
import os

monuments = {

"meenakshi_temple": [
"Meenakshi Temple Madurai",
"Meenakshi Amman Temple gopuram",
"Meenakshi temple architecture",
"Meenakshi temple tower"
],

"brihadeeswarar_temple": [
"Brihadeeswarar Temple Thanjavur",
"Thanjavur Big Temple",
"Brihadeeswarar temple architecture",
"Chola temple Brihadeeswarar"
],

"virupaksha_temple": [
"Virupaksha Temple Hampi",
"Virupaksha temple architecture",
"Virupaksha temple gopuram",
"Hampi Virupaksha temple stone carvings"
],

"murudeshwar_temple": [
"Murudeshwar Temple Karnataka",
"Murudeshwar Shiva statue",
"Murudeshwar temple gopuram",
"Murudeshwar temple aerial view"
],

"padmanabhaswamy_temple": [
"Padmanabhaswamy Temple Trivandrum",
"Padmanabhaswamy temple architecture",
"Padmanabhaswamy temple gopuram",
"Padmanabhaswamy temple Kerala"
],

"tirupati_balaji": [
"Tirupati Balaji temple",
"Tirumala Venkateswara temple",
"Tirupati temple architecture",
"Tirumala temple gopuram"
],

"chennakesava_temple": [
"Chennakesava Temple Belur",
"Belur temple carvings",
"Hoysala temple Belur architecture",
"Chennakesava temple sculpture"
],

"hoysaleswara_temple": [
"Hoysaleswara Temple Halebidu",
"Halebidu temple carvings",
"Hoysala architecture temple",
"Halebidu temple sculpture"
],

"rameswaram_temple": [
"Ramanathaswamy Temple Rameswaram",
"Rameswaram temple corridor",
"Ramanathaswamy temple architecture",
"Rameswaram temple pillars"
],

"shore_temple": [
"Shore Temple Mahabalipuram",
"Mahabalipuram Shore temple",
"Shore temple architecture",
"Pallava shore temple"
]
}

os.makedirs("dataset", exist_ok=True)

for monument, keywords in monuments.items():

    path = f"dataset/{monument}"

    os.makedirs(path, exist_ok=True)

    crawler = BingImageCrawler(storage={'root_dir': path})

    for keyword in keywords:

        print("Downloading:", keyword)

        crawler.crawl(
            keyword=keyword,
            max_num=80
        )

print("Dataset building completed")