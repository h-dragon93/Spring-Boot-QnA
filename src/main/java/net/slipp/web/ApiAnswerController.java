package net.slipp.web;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import net.slipp.domain.Answer;
import net.slipp.domain.AnswerRepository;
import net.slipp.domain.Question;
import net.slipp.domain.QuestionRepository;
import net.slipp.domain.Result;
import net.slipp.domain.User;

@Controller
@RequestMapping("/api/questions/{questionId}/answers")
public class ApiAnswerController {
	@Autowired
	private QuestionRepository questionRepository;
	
	@Autowired
	private AnswerRepository answerRepository;
	
	@PostMapping("")
	@ResponseBody
	public Answer create(@PathVariable Long questionId, String contents, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return null;
		}
		User loginUser = HttpSessionUtils.getUserFromSession(session);
		Question question = questionRepository.findById(questionId).get();
		Answer answer = new Answer(loginUser, question, contents);
		question.addAnswer();
		return answerRepository.save(answer);
	}
	
	@PostMapping("/edit/{rid}")
	public String edit(@PathVariable Long questionId, @PathVariable Long rid, String contents,  Model model, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return "/user/login";
		}	                                                                        //User loginUser = HttpSessionUtils.getUserFromSession(session);
		Optional<Answer> optional = answerRepository.findById(rid);		//Question question = questionRepository.findById(questionId).get();
		if(optional.isPresent()) 
			{
			Answer answer = optional.get();
			User loginUser = HttpSessionUtils.getUserFromSession(session);
			answer.update(contents);
			answerRepository.save(answer); //	
		}
		else {
			System.out.println("Failed");
		}
		return String.format("redirect:/questions/%d", questionId);
	}
	
	@DeleteMapping("/{id}")
	@ResponseBody
	public Result delete(@PathVariable Long questionId, @PathVariable Long id, HttpSession session) {
		if (!HttpSessionUtils.isLoginUser(session)) {
			return Result.fail("Login Plz");
		}
		
		Answer answer = answerRepository.findById(id).get();
		User loginUser = HttpSessionUtils.getUserFromSession(session);
		if (!answer.isSameWriter(loginUser)) {
			return Result.fail("Not your Post");
		}	
		answerRepository.deleteById(id);		
		Question question = questionRepository.findById(questionId).get();
		question.deleteAnswer();
		questionRepository.save(question);
		return Result.ok();

	}
}
