namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estadoONmarco : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EstadoON",
                c => new
                    {
                        EstadoONId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(maxLength: 250),
                        DescripcionCorta = c.String(maxLength: 100),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoONId);
            
            AddColumn("CR.tab_OportunidadNegocios", "EstadoONId", c => c.Int());
            CreateIndex("CR.tab_OportunidadNegocios", "EstadoONId");
            AddForeignKey("CR.tab_OportunidadNegocios", "EstadoONId", "dbo.EstadoON", "EstadoONId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "EstadoONId", "dbo.EstadoON");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "EstadoONId" });
            DropColumn("CR.tab_OportunidadNegocios", "EstadoONId");
            DropTable("dbo.EstadoON");
        }
    }
}
