import random
import time
import os
class Overkill_game_master:

    unused_asset_list = []
    draw_list = []
    timer = None
    bet = None
    players = []
    objective = None

    #Initialising the attributes when game instance is created
    def __init__(self, timer, draw_list, base_score, asset_list):
        self.draw_list = draw_list
        self.timer = timer
        self.bet = 1
        self.players = [None, None]
        self.objective = 21
        self.unused_asset_list = asset_list


    #Try to add a player and return true if success (max amount 2)
    def add_player(self, player):
        if self.players[1] and self.players[0]: return False
        elif self.players[0]:
            self.players[1] = player
            return True
        else:
            self.players[0] = player
            return True

    def remove_draw_card(self):
        return self.draw_list.pop(0)
    
    def initialise(self, player, color):
        card_list = player.red_card_list if color == "red" else player.black_card_list
        undercover_card = player.red_undercovered_card if color == "red" else player.black_undercovered_card
        self.draw_list.extend(card_list)
        if undercover_card: self.draw_list.append(undercover_card)
        card_list.clear()
        undercover_card = None
        random.shuffle(self.draw_list)
        for card in self.draw_list:
            if not undercover_card and card.color == color:
                undercover_card = card
                self.draw_list.remove(card)
            elif not card_list and card.color == color:
                card_list.append(card)
                self.draw_list.remove(card)
            elif card_list and undercover_card:
                break
        if color == "red":
            player.red_undercovered_card = undercover_card
        else:
            player.black_undercovered_card = undercover_card

    def give_asset(self, number):
        random.shuffle(self.unused_asset_list)
        for player in self.players:
            for i in range(number):
                self.unused_asset_list[0].player = player
                player.asset_list.append(self.unused_asset_list[0])
                self.unused_asset_list.pop(0)

    def is_game_over(self):
        for player in self.players:
            if player.score <= 0:
                return True
        return False
    
    def is_round_over(self):
        if len(self.draw_list) == 0: return True
        for player in self.players:
            if player.stayed == False: return False
        return True
    
    def round_winner(self):
        os.system("cls")
        print("Revealing the winner of round\n\n\n")
        time.sleep(3)
        if self.players[0].total_overkill() > self.players[1].total_overkill():
            self.players[0].score -= self.bet
            self.players[1].score += self.bet
            print("Winner of round: Player2", self.players[0].total_overkill(), "Overkills /", self.players[1].total_overkill(), "Overkills")
        elif self.players[0].total_overkill() < self.players[1].total_overkill():
            self.players[0].score += self.bet
            self.players[1].score -= self.bet
            print("Winner of round: Player1", self.players[0].total_overkill(), "Overkills /", self.players[1].total_overkill(), "Overkills")
        else:
            if self.players[0].total_value() > self.players[1].total_value():
                self.players[0].score += self.bet
                self.players[1].score -= self.bet
                print("Winner of round: Player1", self.players[0].total_value(), "Points /", self.players[1].total_value(), "Points")
            elif self.players[0].total_value() < self.players[1].total_value():
                self.players[0].score -= self.bet
                self.players[1].score += self.bet
                print("Winner of round: Player2", self.players[0].total_value(), "Points /", self.players[1].total_value(), "Points")
            else:
                print("No winner")
        self.bet += 1
        print("Score:" + str(self.players[0].score) + "/" + str(self.players[1].score))
        print ("Bet: " + str(self.bet))
        self.players[0].stayed = False
        self.players[1].stayed = False
        time.sleep(5)
        os.system("cls")
    
    def remove_all_player_cards(self):
        for player in self.players:
            self.draw_list.extend(player.red_card_list)
            self.draw_list.append(player.red_undercovered_card)
            self.draw_list.extend(player.black_card_list)
            self.draw_list.append(player.black_undercovered_card)
            player.red_card_list = []
            player.red_undercovered_card = None
            player.black_card_list = []
            player.black_undercovered_card = None
            self.unused_asset_list.extend(player.asset_list)
            player.asset_list = []
        for asset in self.unused_asset_list:
            if asset.is_active or asset.player:
                asset.is_active = False
                asset.player = None