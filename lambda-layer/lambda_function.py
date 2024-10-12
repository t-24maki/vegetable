import requests
from io import BytesIO
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar
import pandas as pd

def lambda_handler(event, context):
    server_url = "https://analysis-navi.com/vegetable/"
    csv_past = "例年価格_R1-R3.csv"
    csv_recent = "直近価格.csv"

    try:
        response_past = requests.get(server_url + csv_past)
        response_recent = requests.get(server_url + csv_recent)

        response_past.raise_for_status()
        response_recent.raise_for_status()

        # CSVデータをDataFrameに変換
        df_term = pd.read_csv(StringIO(response_past.text))
        df_past_all = pd.read_csv(StringIO(response_recent.text))


        # #最新データの取得
        # df_term_new = get_recent_data(df_term)
        # df_recent_get,df_merge = create_json(df_term_new,df_past_all)


        # #最新データのjsonの生成
        # df_recent_get.T.to_json("trend.json",force_ascii=False)
        # df_merge.T.to_json("rate.json",force_ascii=False)



        return {
            'statusCode': 200,
            'body': f"CSV file successfully processed"
        }

    except requests.RequestException as e:
        error_message = f"CSVファイルの取得中にエラーが発生しました: {str(e)}"
        print(error_message)
        return {
            'statusCode': 500,
            'body': error_message
        }
    except Exception as e:
        error_message = f"予期せぬエラーが発生しました: {str(e)}"
        print(error_message)
        return {
            'statusCode': 500,
            'body': error_message
        }