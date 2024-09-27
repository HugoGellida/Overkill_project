class Overkill_saving_asset:

    identifier = None
    is_active = False
    game = None
    player = None
    description = ""

    def __init__(self, identifier, game):
        self.identifier = identifier
        self.is_active = False
        self.game = game
        self.player = None
        if identifier == 1:
            self.description = "Remove one of your last card (color to choose)"
        elif identifier == 2:
            self.description = "Reset one of your deck (color to choose)"
        else:
            self.description = "Replace one of your last card with the lowest card to pick (color to choose)"

    def activate(self):
        choice = input("Choose a color: ")
        card_lists = {
            "red": self.player.red_card_list,
            "black": self.player.black_card_list
        }
        if choice == "red" or choice == "black":
            if self.identifier == 1:
                if len(card_lists[choice]) != 0:
                    self.game.draw_list.append(card_lists[choice].pop())
                    print("Successfully eradicated the card")
                else:
                    print("You wasted your asset: you had no more revealed card of this color")
            elif self.identifier == 2:
                self.game.initialise(player=self.player, color=choice)
                print(f"Successfully resetted your {choice} deck")
            else:
                if len(card_lists[choice]) != 0:
                    self.game.draw_list.append(card_lists[choice].pop())
                    card_lists[choice].extend([card for card in self.game.draw_list if card.value == min([draw_card.value for draw_card in self.game.draw_list if draw_card.color == choice]) and card.color == choice])
                    print(f"Successfully exchanged your last {choice} card with the lowest {choice} value in draw")
                else:
                    print("You wasted your asset: you had no more revealed card of this color")
        else:
            print("You wasted your asset: color unknown")