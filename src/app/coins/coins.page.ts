import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Coin } from '../coin';
import { PopoverController } from '@ionic/angular';
import { CoinmanagementPopoverComponent } from '../coinmanagement-popover/coinmanagement-popover.component';
import { MarketsharePopoverComponent } from '../marketshare-popover/marketshare-popover.component';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.page.html',
  styleUrls: ['./coins.page.scss', '../common.scss'],
})
export class CoinsPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;

  currentFilter: string = '';
  //marketSharePanelVisible: boolean = false; // Change to true to have marketshare section be visible by default

  visibleCoins: Coin[] = []; /* Coins that are visible after filtering */
  coins: Coin[] = []; /* declare coins as array */

  constructor(private apiService: ApiService, private popoverController: PopoverController) {
    this.apiService.getCoins().subscribe(data => {
      this.coins = data;
      this.coins.push({
        id: '9999',
        name: 'denarium',
        symbol: 'Denarium-Custom-Gold-Plated-2018-frontng',
        rank: 9999,
        price_usd: 180,
        price_btc: 10000,
        '24h_volume_usd': 0,
        market_cap_usd: 0,
        available_supply: 0,
        total_supply: 0,
        max_supply: 1000,
        percent_change_1h: 0,
        percent_change_24h: 0,
        percent_change_7d: 0,
        last_updated: 0,
      });
      this.visibleCoins = data;
    });
  }

  doRefresh(event) {
    this.apiService.getCoins().subscribe(data => {
      this.coins = data;
      this.updateVisibleCoins();
      event.target.complete();
    });
  }

  /**
   * Shows popover menu for selected coin
   * @param coin Coin
   */
  async showPopover(coin: Coin) {
    const popoverElement = await this.popoverController.create({
      component: CoinmanagementPopoverComponent,
      componentProps: {
        source: 'page.coins',
        object: coin
      }
    });
    return await popoverElement.present();
  }

  async showMarketsharePopover() {
    const popoverElement = await this.popoverController.create({
      component: MarketsharePopoverComponent,
      componentProps: {
        source: 'page.coins',
        coins: this.coins
      }
    });
    return await popoverElement.present();
  }

  doFilter(event) {
    this.currentFilter = event.detail.value.toLowerCase();
    this.updateVisibleCoins();
  }

  updateVisibleCoins() {
    this.visibleCoins = [];
    this.coins.forEach(coin => {
      var name = coin.name.toLowerCase();
      var symbol = coin.symbol.toLowerCase();
      if (this.currentFilter.length == 0
        || name.indexOf(this.currentFilter) >= 0
        || symbol == this.currentFilter) {
        this.visibleCoins.push(coin);
      }
    });
  }

}
