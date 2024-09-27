

class Overkill_player:

    red_card_list = []
    red_undercovered_card = None
    black_card_list = []
    asset_list = []
    black_undercovered_card = None
    game = None
    score = None
    stayed = False

    def __init__(self, game):
        self.game = game
        self.score = 5
        self.red_card_list = []
        self.red_undercovered_card = None
        self.black_card_list = []
        self.asset_list = []
        self.black_undercovered_card = None
    

    def draw_card(self):
        self.stayed = False
        card = self.game.remove_draw_card()
        if card.color == "black": self.black_card_list.append(card)
        else: self.red_card_list.append(card)
        print("card picked: " + str(card))

    def is_in_overkill(self, color):
        return self.total_value_color(color) > self.game.objective
    
    def total_value_color(self, color):
        card_lists = {
            "black": self.black_card_list,
            "red": self.red_card_list
        }
        undercover_card = self.red_undercovered_card if color == "red" else self.black_undercovered_card
        return sum(card.value for card in card_lists[color]) + undercover_card.value

    def total_value(self):
        return sum(card.value for card in self.black_card_list) + self.black_undercovered_card.value + sum(card.value for card in self.red_card_list) + self.red_undercovered_card.value
    
    def stay(self):
        self.stayed = True
    
    def total_overkill(self):
        return int(self.is_in_overkill("red")) + int(self.is_in_overkill("black"))
    
    def use_asset(self, asset):
        self.asset_list.remove(asset)
        self.game.unused_asset_list.append(asset)
        asset.activate()