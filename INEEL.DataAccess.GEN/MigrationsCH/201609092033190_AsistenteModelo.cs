namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AsistenteModelo : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_Asistentes", "ClaveUnidad", c => c.String(maxLength: 10));
            AddColumn("CH.cat_Asistentes", "ClavePersona", c => c.String());
            AddColumn("CH.cat_Asistentes", "FechaEfectivaNombramiento", c => c.DateTime(nullable: false));
            CreateIndex("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CH.cat_Asistentes", "numEmpleado");
            DropColumn("CH.cat_Asistentes", "Departamento");
            DropColumn("CH.cat_Asistentes", "Tipo");
            DropColumn("CH.cat_Asistentes", "Estado");
            DropColumn("CH.cat_Asistentes", "NombreDepartamento");
            DropColumn("CH.cat_Asistentes", "FechaRegistroInvalido");
            DropColumn("CH.cat_Asistentes", "EstadoLaboral");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_Asistentes", "EstadoLaboral", c => c.Int(nullable: false));
            AddColumn("CH.cat_Asistentes", "FechaRegistroInvalido", c => c.DateTime());
            AddColumn("CH.cat_Asistentes", "NombreDepartamento", c => c.String(maxLength: 100));
            AddColumn("CH.cat_Asistentes", "Estado", c => c.Int(nullable: false));
            AddColumn("CH.cat_Asistentes", "Tipo", c => c.String(maxLength: 25));
            AddColumn("CH.cat_Asistentes", "Departamento", c => c.String(maxLength: 200));
            AddColumn("CH.cat_Asistentes", "numEmpleado", c => c.String(maxLength: 5));
            DropForeignKey("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CH.cat_Asistentes", "FechaEfectivaNombramiento");
            DropColumn("CH.cat_Asistentes", "ClavePersona");
            DropColumn("CH.cat_Asistentes", "ClaveUnidad");
        }
    }
}
