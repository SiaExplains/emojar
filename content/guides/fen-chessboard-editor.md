---
slug: fen-notation-explained-field-by-field
tool: fen-chessboard-editor
title: 'FEN Notation Explained: The Six Fields of a Chess Position'
description: How Forsyth–Edwards Notation records piece placement, side to move, castling, en passant and the move counters, with a worked example after 1.e4 c5.
tags: [Chess, Notation, Explainer]
---

FEN (Forsyth–Edwards Notation) records a complete chess position in a single line of text. It has six fields separated by spaces: where the pieces are, whose turn it is, which castling rights remain, the en passant target square, the halfmove clock and the fullmove number. The starting position is `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`.

## Where does FEN come from?

The notation is named after David Forsyth, a Scottish journalist who published a compact way to describe positions in the 1880s, and Steven J. Edwards, who extended it for computer use in the 1990s. Edwards also wrote the PGN (Portable Game Notation) Standard, and section 16.1 of that document is still the reference definition of FEN. Piece letters follow the English names used in FIDE's algebraic notation: K king, Q queen, R rook, B bishop, N knight and P pawn.

## Field 1: piece placement

The first field describes the board rank by rank, from rank 8 (Black's back rank) down to rank 1, with a `/` between ranks. Each rank is read from the a-file to the h-file.

- **Uppercase letters** are White pieces: `K Q R B N P`.
- **Lowercase letters** are Black pieces: `k q r b n p`.
- **A digit from 1 to 8** stands for that many empty squares in a row.

So `rnbqkbnr` is Black's back rank in the starting position, `8` is a completely empty rank, and `4P3` means four empty squares, a White pawn on the e-file, then three empty squares. Each rank must add up to exactly eight squares, and two digits never appear next to each other. You'd write `8`, not `53`.

## Field 2: side to move

A single letter: `w` if White is to move, `b` if Black is. This matters more than it looks. The same arrangement of pieces can be a win for whoever moves next.

## Field 3: castling availability

This field lists the castling rights that still exist, using `K` (White kingside), `Q` (White queenside), `k` (Black kingside) and `q` (Black queenside), in that order. If no one can castle, it's `-`.

It records rights, not whether castling is legal on this move. White keeps the `K` right while the king and the h1 rook have never moved, even if a bishop is in the way or the king is in check right now. Once the king moves, both of that side's rights are gone for good. Once a rook moves, the right on that side is lost.

## Field 4: en passant target square

If the last move was a pawn advancing two squares, this field names the square the pawn passed over. After White plays e2–e4, the target is `e3`. After Black plays c7–c5, it's `c6`. Otherwise it's `-`.

The PGN Standard records the target square after every two-square pawn move, whether or not an enemy pawn is in position to capture. Some programs only write it when an en passant capture is actually possible. Both forms describe the same position, but tools may treat them as different strings.

## Fields 5 and 6: the move counters

The **halfmove clock** counts halfmoves, meaning single moves by either side, since the last capture or pawn move. It resets to 0 after any capture or pawn move. It exists for the fifty-move rule in the FIDE Laws of Chess: a player can claim a draw once each side has made 50 moves without a capture or a pawn move, which is a halfmove clock of 100. At 150, the 75-move rule makes the game a draw automatically.

The **fullmove number** starts at 1 and goes up by one after each Black move. It tells you which move of the game you're on.

## A worked example: 1.e4 c5

Start from the standard position. White plays e4:

```
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
```

Rank 4 is now `4P3`. Rank 2 is `PPPP1PPP`, with the gap where the e-pawn was. It's Black's turn, all four castling rights remain, the en passant target is `e3`, the halfmove clock is 0 because a pawn moved, and it's still move 1.

Black answers c5, the Sicilian Defence:

```
rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2
```

Rank 7 becomes `pp1ppppp`, rank 5 is `2p5`, White is to move, the target is `c6`, and the fullmove number goes up to 2 because Black has moved.

## Building this position in the editor

The [chess board editor](/online-tool/reference-tools/fen-chessboard-editor) is a position editor, not a game. Moving a piece changes the board but doesn't change whose turn it is or the counters, so you set those yourself. To build the first position above:

1. Press **Start position**.
2. With the **✥ Move** tool selected, drag the e2 pawn to e4, or click it and then click e4.
3. Set **Side to move** to Black.
4. Open the **En-passant square** menu and choose `e3`.

The FEN line under the board now matches the first example. Press **Copy FEN** to copy it. The en passant menu only offers squares that fit the board. For Black to move, it lists only squares behind a White pawn that could have just moved two squares, with its starting square empty.

To place pieces, pick one from the palette and click squares. Clicking the same piece again removes it. **✕ Delete** removes whatever you click, **Empty board** clears everything, and **⇅ Flip board** shows the board from Black's side. With the keyboard, use the arrow keys to move around the board, Enter to pick up and drop a piece, and Delete to remove one.

## Loading a FEN and reading the errors

Paste a FEN into **Load a FEN** and press **Load**, or use **Paste FEN** to read it straight from your clipboard. Missing trailing fields are filled with the usual defaults, because many sites shorten FENs. If the text can't be parsed, nothing changes and you get specific messages, such as "Rank 1 (“RNBQKBN”) covers 7 squares instead of 8."

A FEN that parses but describes an impossible position still loads, with a list of problems so you can fix it. The editor checks for exactly one king per side, no more than 8 pawns or 16 pieces per side, no pawns on the first or eighth rank, castling rights that match the king and rook squares, and an en passant square that fits the side to move. It doesn't check whether a king is in check or whether the position could be reached by legal moves.

The editor keeps the position in the page only. Nothing is uploaded, and nothing is saved when you close the tab, so copy the FEN if you want to keep it. Browsing chess symbols for a document? The [Unicode character explorer](/online-tool/reference-tools/unicode-character-explorer) lists the chess piece characters.

## FAQ

### Why are the ranks written from 8 to 1?

FEN describes the board from White's point of view, starting at the top row of a printed diagram. That's rank 8, Black's back rank.

### Does FEN record the whole game?

No. It records a single position. For the moves that led there, use PGN, which can include a FEN tag to start a game from a set-up position.

### What does "KQkq" mean in a FEN?

Both sides still have both castling rights: White kingside and queenside, then Black kingside and queenside.

Set up your next study position in the [chess board editor](/online-tool/reference-tools/fen-chessboard-editor) and copy its FEN.
