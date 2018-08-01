namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PartIntPer3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_PersonaPartInt", "MunicipioId", "GEN.cat_Municipios");
            DropIndex("CR.tab_PersonaPartInt", new[] { "MunicipioId" });
            DropColumn("CR.tab_PersonaPartInt", "MunicipioId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_PersonaPartInt", "MunicipioId", c => c.Int());
            CreateIndex("CR.tab_PersonaPartInt", "MunicipioId");
            AddForeignKey("CR.tab_PersonaPartInt", "MunicipioId", "GEN.cat_Municipios", "MunicipioId");
        }
    }
}
