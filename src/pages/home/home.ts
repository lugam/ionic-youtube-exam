import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

export const YOUTUBE_API_KEY: string = 'AIzaSyCe3Jf_4CwA5AYrufD-NH_FSB5WnG5-IM0';
export const YOUTUBE_PLAY_URL: string = 'https://www.youtube.com/watch?v=';
export const SEARCH_API_URL: string = 'https://www.googleapis.com/youtube/v3/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public http: HttpClient) {

      platform.ready().then(() => {
        this.doSearch('learning Ionic framework');
      });

  }

  results: Object[];
  
  doSearch(keyword: string) {
    let params: string = [
      `q=${keyword}`,
      `key=${YOUTUBE_API_KEY}`,
      `part=snippet`,
      `type=video`,
      `order=date`,
      `maxResults=15`,
    ].join('&');
    let queryUrl: string = `${SEARCH_API_URL}?${params}`;

    this.http.get(queryUrl).subscribe((response:any) => {
      this.results = response.items.map(item => {
        return new Object({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: new Date(item.snippet.publishedAt)
        });
      });
    });

  }

}


@Component({
  inputs: ['result'],
  selector: 'video-info',
  template: `
    <div class="one-of-content video">
      <div class="content-head">
        <div class="channel">{{result.channelTitle}}</div>
        <div class="caption">{{result.description}}</div>
      </div>
      <div class="thumbnail">
        <img src="{{result.thumbnailUrl}}">
      </div>
      <div class="content-body">
        <h3>{{result.title}}</h3>
      </div>
      <div class="content-foot">
        <div class="wrote">{{result.publishedAt | date:'yyyy-MM-dd HH:mm' }}</div>
      </div>
      <button ion-button full color="danger" (click)="play(result.id)">Play</button>
      <button ion-button full color="primary" (click)="playNative(result.id)">Play Native</button>
    </div>
 `
})
export class VideoInfoComponent {
  result: Object;
  constructor(public navCtrl: NavController, 
    public player: YoutubeVideoPlayer){
  }

  play(videoId) {
    location.href = YOUTUBE_PLAY_URL + videoId;
  }

  playNative(videoId) {
    this.player.openVideo(videoId);
  }
}