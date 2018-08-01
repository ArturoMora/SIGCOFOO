namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgendaCP2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_AgendaCP", "idComunidad", c => c.Int(nullable: false));
            CreateIndex("CP.tab_AgendaCP", "idComunidad");
            AddForeignKey("CP.tab_AgendaCP", "idComunidad", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_AgendaCP", "idComunidad", "CP.tab_Comunidades");
            DropIndex("CP.tab_AgendaCP", new[] { "idComunidad" });
            DropColumn("CP.tab_AgendaCP", "idComunidad");
        }
    }
}
