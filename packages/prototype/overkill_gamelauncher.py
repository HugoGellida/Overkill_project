import random
from overkill_card import *
from overkill_game_master import *
from overkill_player import *
from overkill_asset.overkill_info_asset import *
from overkill_asset.overkill_attack_asset import *
from overkill_asset.overkill_saving_asset import *
import os
import time

#Creating the cards and shuffling them
cards = []
assets = []
for value in range(1, 10):
    for color in ["red", "black"]:
        cards.append(Overkill_card(value, color))
random.shuffle(cards)


for identifier in range(1, 5):
    assets.append(Overkill_info_asset(identifier, None))
for identifier in range(1, 5):
    assets.append(Overkill_attack_asset(identifier, None))
for identifier in range(1, 4):
    assets.append(Overkill_saving_asset(identifier, None))


#Creating the game master
Game_master = Overkill_game_master(60, cards, 5, assets)
for asset in Game_master.unused_asset_list:
    asset.game = Game_master

#Creating assets

#Creating the players
Player1 = Overkill_player(Game_master)
Player2 = Overkill_player(Game_master)

#Associating the players with the game
Game_master.add_player(Player1)
Game_master.add_player(Player2)


currentPlayer = Game_master.players[0]
i = 0


while not Game_master.is_game_over():
    Game_master.give_asset(number=3)
    Game_master.initialise(Player1, "red")
    Game_master.initialise(Player1, "black")
    Game_master.initialise(Player2, "red")
    Game_master.initialise(Player2, "black")
    while not Game_master.is_round_over():
        os.system("cls")
        print ("Player", (i + 1), "turn")
        print("Hidden:", str(currentPlayer.black_undercovered_card), "| Revealed: " + "/".join(str(card) for card in currentPlayer.black_card_list), "| Total: " + str(currentPlayer.total_value_color("black")) + "/" + str(Game_master.objective))
        print("Hidden:", str(currentPlayer.red_undercovered_card), "| Revealed: " + "/".join(str(card) for card in currentPlayer.red_card_list), "| Total: " + str(currentPlayer.total_value_color("red")) + "/" + str(Game_master.objective))
        print("\nAssets: ", " | ".join(asset.description for asset in currentPlayer.asset_list))
        for asset in assets:
            if asset.player == currentPlayer and asset.is_active:
                asset.passive_boost()
        choice = input("Make your choice:\n1: pick a card\n2: stay\n3: Play asset(Does'nt end turn)\nChoice: ")
        if choice == "1":
            currentPlayer.draw_card()
        elif choice == "2":
            currentPlayer.stay()
        elif choice == "3" and currentPlayer.asset_list:
            os.system("cls")
            print("Choose the asset you want to play\n\n" + "\n".join(f"{i}: {currentPlayer.asset_list[i].description}" for i in range(len(currentPlayer.asset_list))))
            asset_choice = int(input("\n"))
            currentPlayer.use_asset(currentPlayer.asset_list[asset_choice])
            time.sleep(2)
        if choice != "3":
            i = (i + 1)%2
            currentPlayer = Game_master.players[i]
            time.sleep(3)
    Game_master.round_winner()
    Game_master.remove_all_player_cards()