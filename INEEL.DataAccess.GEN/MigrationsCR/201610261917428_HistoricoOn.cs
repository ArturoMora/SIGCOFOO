namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HistoricoOn : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_EstadoFlujoON",
                c => new
                    {
                        EstadoFlujoONId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(maxLength: 250),
                        DescripcionCorta = c.String(maxLength: 100),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoFlujoONId);
            
            AddColumn("CR.tab_BitacoraON", "EstadoFlujo", c => c.Int(nullable: false));
            AddColumn("CR.tab_BitacoraON", "EstadoFlujoONId", c => c.Int());
            CreateIndex("CR.tab_BitacoraON", "EstadoFlujoONId");
            AddForeignKey("CR.tab_BitacoraON", "EstadoFlujoONId", "CR.tab_EstadoFlujoON", "EstadoFlujoONId");
            DropColumn("CR.tab_BitacoraON", "EstadoFlujoId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_BitacoraON", "EstadoFlujoId", c => c.Int(nullable: false));
            DropForeignKey("CR.tab_BitacoraON", "EstadoFlujoONId", "CR.tab_EstadoFlujoON");
            DropIndex("CR.tab_BitacoraON", new[] { "EstadoFlujoONId" });
            DropColumn("CR.tab_BitacoraON", "EstadoFlujoONId");
            DropColumn("CR.tab_BitacoraON", "EstadoFlujo");
            DropTable("CR.tab_EstadoFlujoON");
        }
    }
}
