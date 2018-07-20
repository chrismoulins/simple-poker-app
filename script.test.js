describe('Testing functionality', ()=>{
    it('testing getCardNumbericalValue(). Returns correct numeric value', ()=>{
      expect(getCardNumbericalValue('Q')).toBe(12);
      expect(getCardNumbericalValue('A')).not.toBe(1);
    })
    it('testing getHandValues(). Returns array with all cards converted correctly', ()=>{
      expect(getHandValues(['2','4','6','T','3'])).toEqual([2,4,6,10,3]);
      expect(getHandValues(['A','K','A','*','J'])).toEqual([14,13,14,'*',11]);
    })
    it('testing getPokerHandFromCards(). Verify all poker hands return the correct numerical representation.', ()=>{
        //testing High Card hand
        expect(getPokerHandFromCards([2,6,8,10,7])).toBe('');
        //testing One Pair
        expect(getPokerHandFromCards([8,6,8,10,7])).toBe('2');
        //testing Two Pairs
        expect(getPokerHandFromCards([14,14,2,2,3])).toBe('22');
        //testing Three of A Kind
        expect(getPokerHandFromCards([11,14,11,2,11])).toBe('3');
        //testing Straight
        expect(getPokerHandFromCards([1,2,3,4,5])).toBe('5');
        //testing Full House
        expect(getPokerHandFromCards([13,4,13,4,4])).toBe('23');
        expect(getPokerHandFromCards([9,9,10,9,10])).toBe('32');
        //testing Four of a Kind
        expect(getPokerHandFromCards([8,2,8,8,8])).toBe('4');
    })
    it('testing getCardFrequency(). Returns the number of times a card appears in a hand.', ()=>{
        expect(getCardFrequency([13,5,13,6,5], 5)).toEqual(2);
        expect(getCardFrequency([13,5,13,6,5], 6)).toEqual(1);
        expect(getCardFrequency([7,5,7,7,7], 7)).toEqual(4);
        expect(getCardFrequency([7,7,7,7,7], 7)).toEqual(4);
        expect(getCardFrequency([11,5,7,11,11], 11)).toEqual(3);
      })
      it('testing getAllCardFrequencies(). Returns all frequencies for each card in the hand', ()=>{
        let result = [
            {'value': 14,
            'frequency': 3},
            {'value': 2,
            'frequency': 1},
            {'value': 9,
            'frequency': 1}
        ]
        expect(getAllCardFrequencies([14,2,9,14,14])).toEqual(result);
      })
      it('testing checkStraight(). Verifies a few straight hands, and a few that aren\'t', ()=>{
        expect(checkStraight([6,3,5,4,2])).toBe('5');
        expect(checkStraight([14,3,5,4,2])).not.toBe('5');
      })
      it('testing getHumanReadableValue(). Converts numerical representation of poker hand to readible value', ()=>{
        expect(getHumanReadableValue('23')).toBe('Full House');
        expect(getHumanReadableValue('32')).not.toBe('Three of a Kind');
      })
      it('testing resolveStraightTie(). Determines which Straight hand has more value', ()=>{
        expect(resolveStraightTie([4,7,6,5,8],[6,4,7,5,3])).toBe('Hand One is the winner!');
        expect(resolveStraightTie([8,10,9,6,7],[10,13,12,11,9])).toBe('Hand Two is the winner!');
        expect(resolveStraightTie([2,3,6,4,5],[5,4,3,2,6])).toBe('It\'s a tie, neither hand wins!');
      })
      it('testing resolveNonStraightTie(). Determines which hand has more value', ()=>{
        //compare two Full House hands
        expect(resolveNonStraightTie([6,4,6,4,6],[4,6,6,4,4])).toBe('Hand One is the winner!');
        //compare two Four of a Kind hands
        expect(resolveNonStraightTie([9,6,7,8,5],[7,9,10,8,6])).toBe('Hand Two is the winner!');
        //compare two Two Pair hands
        expect(resolveNonStraightTie([4,9,2,9,4],[9,9,4,2,4])).toBe('It\'s a tie, neither hand wins!');
      })
      it('testing compareCardValues(). Compares two card values, and returns what hand is the victor', ()=>{
        expect(compareCardValues(3,2)).toBe('Hand One is the winner!');
        expect(compareCardValues(8,12)).toBe('Hand Two is the winner!');
        expect(compareCardValues(1,1)).toBe('It\'s a tie, neither hand wins!');
      })
      it('testing resolveWildCard(). Provide a hand with a wildcard, return the most valuable hand.', ()=>{
        expect(resolveWildCard([14,8,2,13,'*'])).toEqual([14,8,2,13,14]);
        expect(resolveWildCard([4,5,2,3,'*'])).not.toEqual([4,5,2,3,1]);
        expect(resolveWildCard([4,5,2,3,'*'])).toEqual([4,5,2,3,6]);
        expect(resolveWildCard([13,12,13,13,'*'])).toEqual([13,12,13,13,13]);
      })
      it('testing resolveStraightWithWildCard(). Determine if a wildcard with result in a Straight hand.', ()=>{
        expect(resolveStraightWithWildCard([12,13,10,9,'*'])).toEqual(11);
        expect(resolveStraightWithWildCard([2,3,'*',4,5])).not.toEqual(1);
      })
      it('testing getHighestCard(). Determine the highest card in the hand', ()=>{
        expect(getHighestCard([4,8,2,8,9])).toEqual(9);
        expect(getHighestCard([12,9,8,11,'*'])).toEqual(12);
        expect(getHighestCard([10,14,13,13,14])).not.toEqual(13);
      })
  })