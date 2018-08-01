namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificaExpertosCR : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_InvestigadorPorExperto",
                c => new
                    {
                        InvestigadorExpertoId = c.Int(nullable: false, identity: true),
                        ContactoId = c.Int(nullable: false),
                        ClavePersona = c.String(nullable: false, maxLength: 10),
                        FechaRegistro = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.InvestigadorExpertoId);
            
            DropColumn("CR.cat_Expertos", "ClavePersona");
        }
        
        public override void Down()
        {
            AddColumn("CR.cat_Expertos", "ClavePersona", c => c.String(nullable: false, maxLength: 10));
            DropTable("CR.tab_InvestigadorPorExperto");
        }
    }
}
