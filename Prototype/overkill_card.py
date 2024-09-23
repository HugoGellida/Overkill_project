class Overkill_card:

    value = None
    color = None

    def __init__(self, value, color):
        self.value = value
        self.color = color
    
    def __str__(self):
        return f"{self.value} {self.color.capitalize()}"