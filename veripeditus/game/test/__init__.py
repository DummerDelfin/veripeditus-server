# veripeditus-server - Server component for the Veripeditus game framework
# Copyright (C) 2016  Dominik George <nik@naturalnet.de>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from veripeditus import framework as f

NAME = 'Veripeditus Test Game'
DESCRIPTION = 'A useless test game bundled with the server framework'
AUTHOR = 'Dominik George <nik@naturalnet.de>'
LICENSE = 'AGPL'
VERSION = f.VERSION

HIDE_SELF = True
VISIBLE_RAD_NPCS = 1000000000

class Player(f.Player):
    pass

class Kangoo(f.NPC):
    spawn_osm = {"natural": "tree"}
    default_name = "Kangoo"
    default_image = "avatar_kangaroo"

    def on_talk(self):
        return self.say("foo")
