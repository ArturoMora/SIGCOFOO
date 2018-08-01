namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class aliados1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_ActividadAdicional",
                c => new
                    {
                        ActividadAdicionalId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 300),
                        FechaActividad = c.DateTime(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ActividadAdicionalId);
            
            CreateTable(
                "CR.tab_AdjuntoPorConvenio",
                c => new
                    {
                        AdjuntoPorConvenioId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AdjuntoPorConvenioId);
            
            CreateTable(
                "CR.tab_Aliado",
                c => new
                    {
                        AliadoId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AliadoId);
            
            CreateTable(
                "CR.tab_AreaActividadAdicional",
                c => new
                    {
                        AreaActividadAdicionalId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaActividadAdicionalId);
            
            CreateTable(
                "CR.tab_AreaConvenio",
                c => new
                    {
                        AreaConvenioId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AreaConvenioId);
            
            CreateTable(
                "CR.tab_Convenio",
                c => new
                    {
                        ConvenioId = c.Int(nullable: false, identity: true),
                        ObjetoConvenio = c.String(maxLength: 300),
                        NoConvenio = c.String(maxLength: 20),
                        FechaInicio = c.DateTime(nullable: false),
                        FechaTermino = c.DateTime(nullable: false),
                        TipoAcceso = c.String(maxLength: 15),
                        Firma = c.String(maxLength: 200),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ConvenioId);
            
            CreateTable(
                "CR.tab_PersonalActividadAdicional",
                c => new
                    {
                        PersonalActividadAdicionalId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.PersonalActividadAdicionalId);
            
        }
        
        public override void Down()
        {
            DropTable("CR.tab_PersonalActividadAdicional");
            DropTable("CR.tab_Convenio");
            DropTable("CR.tab_AreaConvenio");
            DropTable("CR.tab_AreaActividadAdicional");
            DropTable("CR.tab_Aliado");
            DropTable("CR.tab_AdjuntoPorConvenio");
            DropTable("CR.tab_ActividadAdicional");
        }
    }
}
