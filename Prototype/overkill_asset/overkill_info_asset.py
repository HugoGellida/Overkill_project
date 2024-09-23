import random
class Overkill_info_asset:

    identifier = None
    is_active = False
    game = None
    player = None
    description = ""

    def __init__(self, identifier, game):
        self.identifier = identifier
        self.game = game
        self.player = None
        if identifier == 1:
            self.description = "Know the color of the next card"
        elif identifier == 2:
            self.description = "Give 3 values including the one of the next card"
        elif identifier == 3:
            self.description = "Know all hidden cards remaining"
        elif identifier == 4:
            self.description = "Know if the next card has the same value than one of your card"
    
    def passive_boost(self):
        if self.is_active:
            if self.identifier == 1:
                color = self.game.draw_list[0].color
                print("The next color to pick is", color)
            elif self.identifier == 2:
                opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
                possible_value_to_draw = [opponent.red_undercovered_card.value, opponent.black_undercovered_card.value]
                possible_value_to_draw.extend([card.value for card in self.game.draw_list[1:]])
                real_value = self.game.draw_list[0].value
                fake_value1 = random.choice(possible_value_to_draw)
                possible_value_to_draw.remove(fake_value1)
                fake_value2 = random.choice(possible_value_to_draw)
                possible_value_to_draw.remove(fake_value2)
                values_chosen = [real_value, fake_value1, fake_value2]
                random.shuffle(values_chosen)
                print(f"The next value to pick is {values_chosen[0]} or {values_chosen[1]} or {values_chosen[2]}")
            elif self.identifier == 3:
                opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
                all_hidden_cards = [opponent.red_undercovered_card, opponent.black_undercovered_card]
                all_hidden_cards.extend(self.game.draw_list)
                print("Here are all the hidden cards:\n", " ".join(str(card) for card in all_hidden_cards))
            else:
                card_values = [card.value for card in self.player.red_card_list]
                card_values.extend([card.value for card in self.player.black_card_list])
                card_values.append(self.player.red_undercovered_card.value)
                card_values.append(self.player.black_undercovered_card.value)
                if card_values.count(self.game.draw_list[0].value):
                    print("One of your card has the same value than the next card")
                else:
                    print("None of your card has the same value than the next card")

    
    def activate(self):
        self.is_active = True

    def __str__(self):
        return f"Information Card {identifier}"