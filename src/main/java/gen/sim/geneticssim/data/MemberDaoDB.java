
package gen.sim.geneticssim.data;

import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import gen.sim.geneticssim.entities.TraitPackage;
import gen.sim.geneticssim.service.utility.AllTraits;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class MemberDaoDB implements MemberDao {

    @Autowired
    JdbcTemplate jdbc;
    
    public MemberDaoDB() {
    }
    
    @Override
    public Member addFounder(Member founder) {
        final String ADD_FOUNDER = "Insert Into `member`(name, primaryDynasty, living, founder) "
                + "Values(?, ?, ?, ?)";
        jdbc.update(ADD_FOUNDER, founder.getName(), founder.getPrimaryDynasty().getName(), true, true);
        int newId = jdbc.queryForObject("Select LAST_INSERT_ID()", Integer.class);
        founder.setMemberId(newId);
        populateTraits(founder);
        return founder;
    }

    private void populateTraits(Member member) {
        final String sql = "Insert Into traitpackage values "
                + "(?, ?, ?, ?, ?, ?, ?)";
        for(TraitPackage tp : member.getTraits().values()) {
            jdbc.update(sql, tp.getTrait().getName(), member.getMemberId(), tp.getValue(), tp.getValuePool()[0], tp.getValuePool()[1], tp.getValuePool()[2], tp.getValuePool()[3]);
        }
    }

    @Override
    public Member populateMemberForDynastyDisplay(Member m, Boolean firstPass) {
        final String sql = "Select * From `member` Where fatherId = ? OR motherId = ?";
        List<Member> children = jdbc.query(sql, new ChildMapper(), m.getMemberId(), m.getMemberId());
        m.setChildren(children);
        if(firstPass) {
            m.setSpouse(getCurrentSpouse(m.getMemberId()));
            m.setPastSpouses(getPastSpouses(m.getMemberId()));
        }
        return m;
    }

    @Override
    public Member retrieveMemberInfo(int memberId, Boolean firstPass) {
        final String sql = "Select * From `member` Where memberId = ?";
        Member member = jdbc.queryForObject(sql, new MemberMapper(), memberId);
        populatePastSpouses(member);
        if(member.getSpouse() != null) {
            member.setSpouse(getMemberNameFromId(member.getSpouse()));
        }
        if(member.getFather() != null) {
            member.setFather(getMemberNameFromId(member.getFather()));
        }
        if(member.getMother() != null) {
            member.setMother(getMemberNameFromId(member.getMother()));
        }
        member = populateMemberForDynastyDisplay(member, firstPass);
        return member;
    }
    
    private Member getMemberNameFromId(Member member) {
        final String GET_NAME = "Select name From `member` Where memberId = ?";
        String name = jdbc.queryForObject(GET_NAME, String.class, member.getMemberId());
        member.setName(name);
        final String GET_PRIMARY = "Select primaryDynasty From `member` Where memberId = ?";
        if(member.getPrimaryDynasty() == null) {
            Dynasty dyn = new Dynasty();
            dyn.setName(jdbc.queryForObject(GET_PRIMARY, String.class, member.getMemberId()));
            member.setPrimaryDynasty(dyn);
        }
        return member;
    }

    private void populatePastSpouses(Member member) {
        final String GET_A = "Select memberIdA From memberPastSpouses Where memberIdB = ?";
        final String GET_B = "Select memberIdB From memberPastSpouses Where memberIdA = ?";
        List<Member> pastSpouses = new ArrayList();
        for(int i : jdbc.queryForList(GET_A, Integer.class, member.getMemberId())) {
            Member spouse = new Member();
            spouse.setMemberId(i);
            pastSpouses.add(getMemberNameFromId(spouse));
        }
        for(int i : jdbc.queryForList(GET_B, Integer.class, member.getMemberId())) {
            Member spouse = new Member();
            spouse.setMemberId(i);
            pastSpouses.add(getMemberNameFromId(spouse));
        }
        member.setPastSpouses(pastSpouses);
    }

    @Override
    public List<Member> getMarriageOptions(Member toMarry) {
        final String sql = "Select * From `member` Where primaryDynasty <> ? AND (spouseId is NULL OR spouseId = ?)";
        return jdbc.query(sql, new MemberMapper(), toMarry.getPrimaryDynasty().getName(), 0);
    }

    @Override
    public void arrangeMarriage(int maleId, int femaleId, boolean matrilineal) {
        final String sql = "Update `member` Set spouseId = ?, matrilineal = ? Where memberId = ?";
        jdbc.update(sql, maleId, matrilineal, femaleId);
        jdbc.update(sql, femaleId, matrilineal, maleId);
    }

    @Override
    public void saveChild(Member child) {
        final String cMEM = "Insert Into `member` (name, primaryDynasty, fatherId, motherId, living, founder)"
                + " values (?, ?, ?, ?, ?, ?)";
        final String cTRAITS = "Insert Into traitpackage (name, memberId, value, vpA, vpB, vpC, vpD)"
                + " values (?, ?, ?, ?, ?, ?, ?)";
        final String cDYNS = "Insert Into memberSecondarydynasties (memberId, name, indexOrder)"
                + " values (?, ?, ?)";
        jdbc.update(cMEM, child.getName(), child.getPrimaryDynasty().getName(), child.getFather().getMemberId(), child.getMother().getMemberId(), true, false);
        int newId = jdbc.queryForObject("Select LAST_INSERT_ID()", Integer.class);
        Map<String, TraitPackage> tpMap = child.getTraits();
        for(Trait t : AllTraits.getAllTraits()) {
            TraitPackage tp = tpMap.get(t.getName());
            jdbc.update(cTRAITS, t.getName(), newId, tp.getValue(), tp.getValuePool()[0], tp.getValuePool()[1], tp.getValuePool()[2], tp.getValuePool()[3]);
        }
        for(int i = 0; i < child.getNonprimaryDynasties().size(); i++) {
            Dynasty cur = child.getNonprimaryDynasties().get(i);
            jdbc.update(cDYNS, newId, cur.getName(), i);
        }
    }

    @Override
    public Member getCurrentSpouse(int memberId) {
        Member m = retrieveMemberInfo(memberId, false);
        Member spouse = null;
        final String sql = "Select * From `member` Where memberId = ?";
        if(m.getSpouse() != null) {
            spouse = jdbc.queryForObject(sql, new ChildMapper(), m.getSpouse().getMemberId());
        }
        return spouse;
    }

    @Override
    public List<Member> getPastSpouses(int memberId) {
        Member m = retrieveMemberInfo(memberId, false);
        List<Member> pastSpouses = new ArrayList();
        final String sql = "Select * From `member` Where memberId = ?";
        if(m.getPastSpouses().size() > 0) {
            for(Member s : m.getPastSpouses()) {
                pastSpouses.add(jdbc.queryForObject(sql, new ChildMapper(), s.getMemberId()));
            }
        }
        return pastSpouses;
    }
    
    public static final class FounderMapper implements RowMapper<Member> {

        @Override
        public Member mapRow(ResultSet rs, int index) throws SQLException {
            Member founder = new Member();
            founder.setFounder(true);
            founder.setLiving(true);
            founder.setName(rs.getString("name"));
            return founder;
        }
         
    }
    
    public static final class ChildMapper implements RowMapper<Member> {
        @Override
        public Member mapRow(ResultSet rs, int index) throws SQLException {
            Member child = new Member();
            child.setMemberId(rs.getInt("memberId"));
            child.setName(rs.getString("name"));
            Dynasty dyn = new Dynasty();
            dyn.setName(rs.getString("primaryDynasty"));
            child.setPrimaryDynasty(dyn);
            return child;
        }
    }
    
    public static final class MemberMapper implements RowMapper<Member> {

        @Override
        public Member mapRow(ResultSet rs, int index) throws SQLException {
            Member member = new Member();
            member.setMemberId(rs.getInt("memberId"));
            member.setLiving(rs.getBoolean("living"));
            member.setFounder(rs.getBoolean("founder"));
            member.setName(rs.getString("name"));
            Dynasty dyn = new Dynasty();
            dyn.setName(rs.getString("primaryDynasty"));
            member.setPrimaryDynasty(dyn);
            if(rs.getInt("spouseId") != 0) {
                member.setMatrilineal(rs.getBoolean("matrilineal"));
                Member spouse = new Member();
                spouse.setMemberId(rs.getInt("spouseId"));
                member.setSpouse(spouse);
            }
            if(rs.getInt("fatherId") != 0) {
                Member father = new Member();
                father.setMemberId(rs.getInt("fatherId"));
                member.setFather(father);
            }
            if(rs.getInt("motherId") != 0) {
                Member mother = new Member();
                mother.setMemberId(rs.getInt("motherId"));
                member.setMother(mother);
            }
            return member;
        }
        
    }
}
