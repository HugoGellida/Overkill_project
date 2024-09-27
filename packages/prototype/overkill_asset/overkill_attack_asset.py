import random


class Overkill_attack_asset:

    identifier = None
    is_active = False
    game = None
    player = None
    description = ""

    def __init__(self, identifier, game):
        self.identifier = identifier
        self.game = game
        self.player = None
        self.is_active = False
        if identifier == 1:
            self.description = "Remove last card of opponent (color to choose)"
        elif identifier == 2:
            self.description = "Remove a passive played asset of opponent"
        elif identifier == 3:
            self.description = "Add a card to opponent (color to choose)"
        else:
            self.description = "Reset an opponent's deck (color to choose)"

    def activate(self):
        if self.identifier == 1:
            opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
            print("Which card do you wanna remove?\n", f"1: {str(opponent.red_card_list[len(opponent.red_card_list) - 1])}\n2: {str(opponent.black_card_list[len(opponent.black_card_list) - 1])}")
            choice = int(input("\n"))
            if choice == 1: #red
                self.game.draw_list.append(opponent.red_card_list.pop())
            elif choice == 2:
                self.game.draw_list.append(opponent.black_card_list.pop())
            print("Successfully eradicated the card")
            random.shuffle(self.game.draw_list)
        elif self.identifier == 2:
            opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
            asset_to_deactivate = []
            for asset in self.game.unused_asset_list:
                if asset.is_active and asset.player == opponent:
                    asset_to_deactivate.append(asset)
            print("Choose an asset to deactivate:\n", "\n".join(f"{i}: {asset_to_deactivate[i].description}" for i in range(len(asset_to_deactivate))))
            choice = int(input("\n"))
            asset_to_deactivate[choice].is_active = False
            asset_to_deactivate[choice].player = None
            print("Successfully eradicated the passive asset played")
        elif self.identifier == 3:
            opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
            choice = input("Choose a color")
            card_lists = {
                "red": opponent.red_card_list,
                "black": opponent.black_card_list
            }
            found_card = False
            for card in self.game.draw_list:
                if card.color == choice:
                    self.game.draw_list.remove(card)
                    card_lists[choice].append(card)
                    found_card = True
                    print(f"Successfully added a {choice} card to opponent")
                    break
            if not found_card:
                print(f"There are no more {choice} card to draw")
        else:
            opponent = self.game.players[0] if self.game.players[1] == self.player else self.game.players[1]
            choice = input("Choose a color")
            card_lists = {
                "red": opponent.red_card_list,
                "black": opponent.black_card_list
            }
            undercovered_cards = {
                "red": opponent.red_undercovered_card,
                "black": opponent.black_undercovered_card
            }
            if choice == "red" or choice == "black":
                self.game.initialise(player=opponent, color=choice)
                print(f"Successfully resetted opponent's {choice} deck")