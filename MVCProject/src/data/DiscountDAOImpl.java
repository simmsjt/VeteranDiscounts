package data;

import java.io.IOException;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import entities.Discount;
import entities.Location;
import entities.User;

@Transactional
@Repository
public class DiscountDAOImpl implements DiscountDAO {

	@PersistenceContext
	private EntityManager em;

	@Override
	public Discount showDiscount(int discountId) {

		Discount d = em.find(Discount.class, discountId);
		if (d != null) {
			return d;

		} else {
			return null;
		}
	}

	@Override
	public Set<Discount> getDiscountsForLocation(int locationId) {
		String q = "SELECT l FROM Location l JOIN FETCH l.discounts WHERE l.id = :id ";
		Location l = em.createQuery(q, Location.class).setParameter("id", locationId).getResultList().get(0);
		return l.getDiscounts();
	}

	@Override
	public Discount createDiscount(String json, int userId) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			Discount d = mapper.readValue(json, Discount.class);
			User u = em.find(User.class, userId);
			d.setCreator(u);
			em.persist(d);
			em.flush();
			return d;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean deleteDiscount(int discountId, int userId) {
		Boolean b = false;
		Discount d = em.find(Discount.class, discountId);
		if (d.getCreator().getId() == userId) {
			em.remove(d);
			if (em.find(Discount.class, discountId) == null) {
				b = true;
				return b;
			} else {

				return b;
			}

		} else {

			return b;
		}
	}

	@Override
	public Discount updateDiscount(int discountId, int uid, String json) {
		Discount discountToUpdate = em.find(Discount.class, discountId);
		ObjectMapper mapper = new ObjectMapper();
		if (discountToUpdate.getCreator().getId() == uid) {
			try {
				Discount updated = mapper.readValue(json, Discount.class);
				discountToUpdate.setAmount(updated.getAmount());
				discountToUpdate.setStartDate(updated.getStartDate());
				discountToUpdate.setEndDate(updated.getEndDate());
				discountToUpdate.setInfo(updated.getInfo());
				return discountToUpdate;
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		} else {
			return null;
		}
	}

}
