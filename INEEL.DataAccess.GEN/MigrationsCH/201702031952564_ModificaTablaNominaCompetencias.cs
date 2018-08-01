namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificaTablaNominaCompetencias : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_NominaCompetencias", "FamiliaId", c => c.Int());
            CreateIndex("CH.cat_NominaCompetencias", "FamiliaId");
            AddForeignKey("CH.cat_NominaCompetencias", "FamiliaId", "CH.tab_FamiliaPuestos", "FamiliaId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_NominaCompetencias", "FamiliaId", "CH.tab_FamiliaPuestos");
            DropIndex("CH.cat_NominaCompetencias", new[] { "FamiliaId" });
            DropColumn("CH.cat_NominaCompetencias", "FamiliaId");
        }
    }
}
