package com.hy.chatapp;

import java.time.LocalDateTime;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RequiredArgsConstructor
@RestController
public class ChatController {
	
	private final ChatRepository chatRepository;
	
	@GetMapping(value = "/sender/{sender}/receiver/{receiver}",produces = MediaType.TEXT_EVENT_STREAM_VALUE) // TEXT_EVENT_STREAM_VALUE이게 sse 프로토콜인데 이걸로 flux로 계속 데이터 흘려보낼수있음
	public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) {
		return chatRepository.mFindBySender(sender, receiver)
				.subscribeOn(Schedulers.boundedElastic());
	}
	
	@PostMapping("/chat")
	public Mono<Chat> setMsg(@RequestBody Chat chat){ // Mono는 데이터 한번만 리턴
		chat.setCreatedAt(LocalDateTime.now());
		return chatRepository.save(chat);
	}
	
	
}
