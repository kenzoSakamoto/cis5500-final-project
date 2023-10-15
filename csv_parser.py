import os
import pandas as pd
import sys
from tqdm import tqdm

def concatenate_csv_files(folder_path):
    combined_data = pd.DataFrame()

    csv_files = [filename for filename in os.listdir(folder_path) if filename.endswith(".csv")]

    progress_bar = tqdm(total=len(csv_files), unit="file")

    for filename in csv_files:
        file_path = os.path.join(folder_path, filename)

        data = pd.read_csv(file_path)
        data['Ticker'] = os.path.splitext(filename)[0]  # Extract filename without extension
        combined_data = pd.concat([combined_data, data], ignore_index=True)

        progress_bar.set_description(f"Processing: {filename}")
        progress_bar.update(1)

    progress_bar.close()

    return combined_data

def main():
    if len(sys.argv) != 3:
        print("Usage: python script.py folder_path output_file.csv")
        return

    folder_path = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isdir(folder_path):
        print("Folder does not exist!")
        return

    combined_data = concatenate_csv_files(folder_path)

    combined_data.to_csv(output_file, index=False)

    print("Output saved to", output_file)

if __name__ == "__main__":
    main()