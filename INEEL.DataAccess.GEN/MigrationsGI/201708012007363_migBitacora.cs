namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migBitacora : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_BitacoraMovimientosGI",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(nullable: false, maxLength: 10),
                        Fecha = c.DateTime(nullable: false),
                        Movimiento = c.String(nullable: false),
                        OcsId = c.String(nullable: false, maxLength: 100),
                        RegistroId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("GI.tab_BitacoraMovimientosGI");
        }
    }
}
