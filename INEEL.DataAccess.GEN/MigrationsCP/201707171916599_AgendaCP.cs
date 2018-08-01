namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgendaCP : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CP.tab_AgendaCP",
                c => new
                    {
                        AgendaId = c.Int(nullable: false, identity: true),
                        Asunto = c.String(),
                        Lugar = c.String(),
                        FechaReunion = c.DateTime(nullable: false),
                        HoraReunion = c.DateTime(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        NotificacionEnviada = c.Boolean(nullable: false),
                        Autor = c.String(),
                    })
                .PrimaryKey(t => t.AgendaId);
            
        }
        
        public override void Down()
        {
            DropTable("CP.tab_AgendaCP");
        }
    }
}
